import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import ModelsRoute from './routes/models.route';

const app = new App([new IndexRoute(), new ModelsRoute()]);

app.listen();
