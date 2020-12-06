FROM node

# ENV NPM_CONFIG_LOGLEVEL warn
# if left blank app will run with dev settings
ARG app_env
ENV NODE_ENV $app_env

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

# if production setting will build optimized static files and serve using http-server
CMD if [ ${NODE_ENV} = production ]; \
	then \
	npm install -g http-server && \
	npm run build && \
	cd build && \
	hs -p 3000; \
	else \
	npm run start; \
	fi
