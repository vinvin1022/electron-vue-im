import $http from '@/severConfig';
const state = {
    tearcherInfo: {}, //教师信息
    studentList:[],
    refreshGroupSend:1,
    refreshSendText:1,
    quiteText:'',
    faqData:null,
    quickReplyData:null,
}

//不能在页面直接使用state调用projectList,必须使用getters才能调用
const getters = {
    getTearcherInfo: state => state.tearcherInfo,
    getStudentList:state=>state.studentList,
    getRefreshGroupSend:state=>state.refreshGroupSend,
    getQuiteText:state=>state.quiteText,
    getRefreshSendText:state=>state.refreshSendText,
    getFaqData:state=>state.faqData,
    getQuickReplyData:state=>state.quickReplyData,
}

const actions = {

}

//同步状态更改，同步动作
const mutations = {
    setTearcherInfo(state,payload) {
        state.tearcherInfo = payload;
    }, 
    setStudentList(state,payload){
        state.studentList = payload;
    },
    setRefreshGroupSend(state){
        state.refreshGroupSend++;
    },
/*     setRefreshSendText(state){
        state.refreshSendText++;
    }, */
    setQuiteText(state,payload){
        state.refreshSendText++;
        state.quiteText=payload;
    },
    setFqaData(state,payload){
        $http("getFAQ")
        .then(res => {
            state.faqData=res.data||[];
            payload.callBack&&payload.callBack();
            // this.studentDetail=res.data||[];
        })
        .catch(err => {
            payload.callBack&&payload.callBack();
        });
    },
    setQuickReplyData(state,payload){
        $http("getQuickReply")
        .then(res => {
            state.quickReplyData=res.data||[];
            payload.callBack&&payload.callBack();
            // this.studentDetail=res.data||[];
        })
        .catch(err => {
            payload.callBack&&payload.callBack();
        });
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
