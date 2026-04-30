#!/bin/sh
set -eu

ES_URL="${ES_URL:-http://elasticsearch:9200}"
CANAL_ADAPTER_URL="${CANAL_ADAPTER_URL:-http://canal-adapter:8081}"

wait_for_url() {
  url="$1"
  name="$2"
  retries="${3:-60}"
  count=0

  until curl -fsS "$url" >/dev/null; do
    count=$((count + 1))
    if [ "$count" -ge "$retries" ]; then
      echo "Timed out waiting for $name: $url"
      exit 1
    fi
    sleep 2
  done
}

create_index_if_missing() {
  index="$1"
  body="$2"

  if curl -fsS -I "$ES_URL/$index" >/dev/null; then
    echo "Elasticsearch index already exists: $index"
    return
  fi

  echo "Creating Elasticsearch index: $index"
  curl -fsS -X PUT "$ES_URL/$index" \
    -H 'Content-Type: application/json' \
    -d "$body" >/dev/null
}

wait_for_url "$ES_URL/_cluster/health" "Elasticsearch"
wait_for_url "$CANAL_ADAPTER_URL/destinations" "Canal Adapter"

create_index_if_missing "big_market.user_raffle_order" '{
  "mappings": {
    "properties": {
      "_user_id": {"type": "keyword"},
      "_activity_id": {"type": "long"},
      "_activity_name": {"type": "keyword"},
      "_strategy_id": {"type": "long"},
      "_order_id": {"type": "keyword"},
      "_order_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},
      "_order_state": {"type": "keyword"},
      "_create_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},
      "_update_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}
    }
  }
}'

create_index_if_missing "big_market.raffle_activity_order" '{
  "mappings": {
    "properties": {
      "_user_id": {"type": "keyword"},
      "_sku": {"type": "long"},
      "_activity_id": {"type": "long"},
      "_activity_name": {"type": "keyword"},
      "_strategy_id": {"type": "long"},
      "_order_id": {"type": "keyword"},
      "_order_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},
      "_total_count": {"type": "integer"},
      "_day_count": {"type": "integer"},
      "_month_count": {"type": "integer"},
      "_pay_amount": {"type": "double"},
      "_state": {"type": "keyword"},
      "_out_business_no": {"type": "keyword"},
      "_create_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},
      "_update_time": {"type": "date", "format": "yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}
    }
  }
}'

for file in \
  big_market_01_user_raffle_order_000.yml \
  big_market_01_user_raffle_order_001.yml \
  big_market_01_user_raffle_order_002.yml \
  big_market_01_user_raffle_order_003.yml \
  big_market_02_user_raffle_order_000.yml \
  big_market_02_user_raffle_order_001.yml \
  big_market_02_user_raffle_order_002.yml \
  big_market_02_user_raffle_order_003.yml
do
  echo "Running Canal Adapter ETL: $file"
  curl -fsS -X POST "$CANAL_ADAPTER_URL/etl/es7/$file"
  echo
done

echo "Elasticsearch and Canal Adapter initialization completed."
