import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ArticleService } from '../service/article.service'
import { AuthService } from '../service/auth.service';
import { PostFragment, PostInput, PostTopic, PostPatch } from '../gen/apollo-types'

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  private loading: boolean;
  private post: PostFragment;
  private postForm: FormGroup  // stores mutable values
  private querySubscription: any = null;
  private topics: any[];
  private isNew: boolean;
  private id: number;
  private currentPersonId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private article: ArticleService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
  ) {
    this.postForm = this.formBuilder.group({
      headline: ['', Validators.required],
      body:     ['', Validators.maxLength(199)],
      topic:    null,
    })
    this.topics = Object.keys(PostTopic)
  }

  // id, author_id, headline, body, topic, created_at

  ngOnInit() {
    this.isNew = !!this.route.snapshot.data['isNew']
    this.id = parseInt(this.route.snapshot.paramMap.get('id'))

    this.auth.currentPerson()
      .subscribe((currentPerson) => this.currentPersonId = currentPerson.id)

    if (this.isNew) {
      this.post = {
        id: null,
        headline: '',
        body: '',
        topic: null,
        createdAt: null,
        personByAuthorId: null,
      }
      this.resetForm()
    } else {
      this.querySubscription = this.article.queryPost(this.id)
        .subscribe(this.updateForm.bind(this))
    }
  }

  private updateForm({data}) {
    if (data.postById) {
      const {__typename, ...post} = data.postById
      this.post = post
      this.resetForm()
    }
  }

  private resetForm() {
    this.postForm.reset({
      headline: this.post.headline,
      body:     this.post.body,
      topic:    this.post.topic,
    })
  }

  private createPost() {
    const newPost: PostInput = {
      authorId: this.currentPersonId,
      headline: this.post.headline,
      body:     this.post.body,
      topic:    this.post.topic,
      ...this.postForm.value
    }
    this.article.createPost(newPost)
      .subscribe(this.updateForm.bind(this));
  }

  private updatePost() {
    const optimisitcPost: PostFragment = {
      ...this.post,
      ...this.postForm.value
    }
    this.article.updatePost(this.postForm.value, optimisitcPost)
      .subscribe(this.updateForm.bind(this));
  }

  private submit() {
    if (this.isNew) {
      this.createPost()
    } else {
      this.updatePost()
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
