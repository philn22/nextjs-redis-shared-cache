build:
	docker compose up --build -d

build_local:
	docker compose -f docker-compose.local.yml up --build -d


down:
	docker compose down


down_local:
	docker compose -f docker-compose.local.yml down
