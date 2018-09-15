import router from './index' ;
import { Message } from 'element-ui';

let turnPage=(message,link)=>{
    if(message){
        Message.warning(message)
    }
    if(link){
        router.push(link);
    }
}
export default turnPage;