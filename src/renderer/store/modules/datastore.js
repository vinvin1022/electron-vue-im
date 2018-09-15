// import datastore from '@/datastore'
import Nedb from 'nedb'
import path from 'path'
import { remote } from 'electron'

export const datastore = function (userAccid){
    const filename = path.join(__dirname, `../../../userDatadb/${userAccid}data.db`);
    return new Nedb({
        autoload: true,
        filename: filename
    })
}

const state = {
    db:{},
}

const getters = {

}

const actions = {
    
}

const mutations = {
    createdDB(state, payload){
        let db = {};
        db.session = datastore(`${payload.accid}/session`);
        db.usersInfo = datastore(`${payload.accid}/usersInfo`);
        state.db=db;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
