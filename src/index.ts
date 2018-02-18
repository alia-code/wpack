if (module && module.hot) {
    module.hot.accept();
}

import moment from 'moment';
import './admin.scss';
import './main.scss';

window.document.getElementsByTagName('main')[0]
    .innerHTML = `<h2>Right now is: <b>
    ${moment().format('DD/MM/YYYY hh:mm:ss')}</b></h2>`;
