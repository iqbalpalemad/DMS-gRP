FROM node:latest
WORKDIR /dms-grpc
COPY . .
RUN npm install
EXPOSE 5005
CMD ["npm", "start"]