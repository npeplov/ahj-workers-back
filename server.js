const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

class Articles {
  constructor(id, title, description) {
    this.id = id // идентификатор (уникальный в пределах системы)
    this.title = title  // имя
    this.description = description // краткое описание
    this.created = new Date() // дата создания (timestamp)
    this.image = 'https://picsum.photos/50';
  }
}

let articlesArr = [
  new Articles(0, 'Superman', 'Witcher in blue tricko', new Date().toString().slice(3,21)),
  new Articles(1, 'Darkwing Duck', 'I am horror flying on night wings', new Date().toString().slice(3,21)),
  new Articles(2, 'Big bang theory', 'Serial about scientists', new Date().toString().slice(3,21)),
];

// CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  
  const headers = { 'Access-Control-Allow-Origin': '*', };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

function sendResponse() {
  let result = 0;
  for (let i = 0; i < 3000000000; i += 1) {
    result += 1;
  }
  return articlesArr;
}


app.use(async ctx => {
  console.log(ctx.request);
  // const params = new URLSearchParams(ctx.request.querystring);
  // const obj = { method: params.get('method'), id: params.get('id') };
  // const { method, id } = obj;
  // const { body } = ctx.request;

  // console.log('method:', method, 'id:', id, 'ctx', body);

  // switch (method) {
  //   case 'allTickets':

  ctx.response.body = sendResponse();
    //   return;
    // default:
    //   ctx.response.status = 404;
    //   return;
  // }
});

app.use(async (ctx) => {
  console.log('request.querystring:', ctx.request.querystring);
  console.log('request.body', ctx.request.body);
  ctx.response.status = 204;
  console.log(ctx.response);
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
