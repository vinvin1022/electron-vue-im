import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
export default function(userAccid){
    let url= process.env.NODE_ENV === 'development'
    ? '': __dirname;
    // const filename = path.join(url, `static/userDatadb/${userAccid}data.db`);
    let filename=path.join(remote.app.getPath('userData'), `${userAccid}data.db`);
    return new Datastore({
        autoload: true,
        filename: filename
    })
}