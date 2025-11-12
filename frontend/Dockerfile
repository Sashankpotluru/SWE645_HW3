# SSSN — React frontend (nginx serve)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# (optional) add custom nginx.conf if you need SPA fallback
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
