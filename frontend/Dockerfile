FROM node:20

WORKDIR /app

# Only copy package.json and package-lock.json first for better caching
COPY frontend/package*.json ./

RUN npm install

# Now copy the rest of your frontend code
COPY frontend/. .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]