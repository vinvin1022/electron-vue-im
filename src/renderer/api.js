const api={
    login:'/message/IM/notcheck/login',//登录
    getGroupStuInfo:'/message/IM/getGroupStuInfo',//获取学员列表
    addStuGroup:'/message/IM/addStuGroup',//添加分组
    renameGroup:'/message/IM/renameGroup',//分组重命名
    delStuGroup:'/message/IM/delStuGroup',//删除分组
    changeStuGroup:'/message/IM/changeStuGroup',//分组成员管理
    sendGroupMessage:'/message/IM/sendGroupMessage',//群发消息
    groupLog:'/message/IM/groupLog',//群发日志
    getStudentInfo:'/message/IM/getStudentInfo',//获取左侧学员信息
    getNewStudentInfo:'/message/IM/getNewStudentInfo',//根据IM账号获取学员信息
    delFAQ:'/message/FAQ/delFAQ',//删除FAQ    
    getFAQ:'/message/FAQ/getFAQ',//获取FAQ
    saveFAQ:'/message/FAQ/saveFAQ',//新增FAQ
    updateFAQ:'/message/FAQ/updateFAQ',//更新FAQ
    getQuickReply:'/message/FAQ/getQuickReply',//获取快捷回复
    addQuickReply:'/message/FAQ/addQuickReply',//新增快捷回复
    delQuickReply:'/message/FAQ/delQuickReply',//删除快捷回复
    updateQuickReply:'/message/FAQ/updateQuickReply',//更新快捷回复
    queryUserListByUserIds:'/mms/personnel/queryUserListByUserIds',//隶属信息
    checkVersion:'/message/IM/notcheck/checkVersion',
    qryCategorySetting:'/mms/category/qryCategorySetting', //查询服务类型类别信息
    feedback:'/asm/asmOrdersBiz/feedback',// 联系学员
    saveStudent:'/mms/student/saveStudent', //保存联系学员记录管理
    isBinding:'/ftms/counselor/isBinding',//验证分机号是否绑定
}
export default api