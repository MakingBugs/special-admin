const getComponent = (component) => () => import (`@/pages${component}`)
export function dynamicRouter(userRouter = []) {
    // var realRoutes = userRouter.map(item => ({
    //     path: item.url,
    //     component: getComponent(item.url),
    //     name: item.url,
    //     meta: {
    //         name: item.menuName,
    //         icon: 'example'
    //     },
    //     children: item.subMenues ? dynamicRouter(item.subMenues): null
    // }))
    var realRoutes = userRouter.map(item => {
        let current = {
            path: item.url,
            component: getComponent(item.url),
            name: item.url,
            meta: {
                name: item.menuName,
                id:item.id,
                icon: 'example'
            },
            children: item.subMenues ? dynamicRouter(item.subMenues): null
        }
        if(item.url.split('/').length-1==1&&item.subMenues&&item.subMenues.length>0){
            current.redirect = item.subMenues[0].url
        }
        return current
    })
    return realRoutes
}

