export PGPASSWORD=$POSTGRES_PASSWORD

for script in "$@"
do
  psql -h localhost \
      -d $POSTGRES_DB \
      -U $POSTGRES_USER \
      -p $POSTGRES_PORT \
      -a -w -f $script
done
