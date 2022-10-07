const state = {
    isVisibleMenu:false,
    posts:[]
}


function toggleMenu(value){
    const elementMenu = document.getElementById('menu-action')

    if(value === 'close'){
        elementMenu.style.width = '10px'
        elementMenu.style.padding = '0px'
        elementMenu.style.opacity = '0'
        state.isVisibleMenu = false
        return 
    }
    
    else if(state.isVisibleMenu) {
        elementMenu.style.width = '10px'
        elementMenu.style.padding = '0px'
        elementMenu.style.opacity = '0'
    }
    else {
        elementMenu.style.width = '300px'
        elementMenu.style.padding = '15px'
        elementMenu.style.opacity = '1'
    }

    state.isVisibleMenu = !state.isVisibleMenu
}

function closeMenuToClickContent(){
  const elementContentBox = document.getElementsByClassName('posts')[0]
  const elementContentStories= document.getElementsByClassName('stories')[0]
  elementContentBox.addEventListener('click', (e) => toggleMenu('close'))
  elementContentStories.addEventListener('click', (e) => toggleMenu('close'))
}


function loadMenuLabels(){
    const url = `http://192.168.0.105:5500/data/Menu.json`
    fetch(url).then(res => res.json()).then(res => {
       const infoAccount = document.getElementsByClassName('info-account')[0]
       const menu = document.getElementsByClassName('nav-container')[0]

       res.info.forEach((item,i) => {
        const element = document.createElement('div')
        const border = i === 1 ? ' info-box-border' : ''
        element.setAttribute('class','info-box flex column items-center'+border)
        element.innerHTML = `
                            <div class="text-bolder info-number"><span>50</span></div>
                            <div class="text-bold  info-title"><span></span>${item}</div>
                            `
        infoAccount.appendChild(element)                    
       })


       res.menu.forEach((item,i) => {
        const element = document.createElement('div')
        const top = i === 0 ? ' mt-sm' : ''
        const notify = i === 3 ? `<div class="nav-notify text-white bg-notify text-bold flex items-center justify-center">
                                    2
                                </div>` 
                                : ''
        const last = i === res.menu.length - 1 ? ' mt-lg' : ''                        

        element.setAttribute('class','nav-single mb-md'+top+last)
        element.innerHTML = `
                        <a class="flex nowrap justify-between text-dark text-bold items-center" href="">
                            <div class="flex items-center  nowrap ">
                                <i class="${item.icon} nav-icon mr-md"></i>
                                ${item.label}
                            </div>
                            ${notify}
                        </a>
        `
        menu.appendChild(element) 
       })

      
    })
}


function loadStories(){
    const url = 'http://192.168.0.105:5500/data/Stories.json'
    fetch(url).then(res => res.json()).then(res => {
        const elementListStories = document.getElementById('list-stories')
        
        res.forEach(item => {
            const story = document.createElement('div')

            story.setAttribute('class','storie-single mr-sm bg-gradient-accent cursor-pointer flex items-center justify-center')
            story.innerHTML = `<img src="${item.link}" alt="${item.title}">`
            
            elementListStories.appendChild(story)
        })
        
    })
}


function modelPosts(item){
    return `<div class="post-single flex column">
    <img class="mb-md" src="${item.post_url}" >
    <div class="user-post-info flex nowrap justify-between">
        <div class="flex nowrap ">
            <div class="avatar cursor-pointer mr-sm ${item.story ? 'bg-gradient-accent' : ''} flex items-center justify-center"><img src="${item.user_avatar}" ></div>
            <div class="flex column justify-center cursor-pointer">
                <span class="name text-bolder">${item.name}</span>
                <span class="username text-grey1 text-bold">${item.user_name}</span>
            </div>
        </div>
        <div class="actions text-grey1 flex nowrap items-center ">
            <div class="flex nowrap items-center">
                <i class="fa fa-heart-o cursor-pointer" id="like-key-${item.id}" onclick="setLike('like-key-${item.id}')"></i>
                <span class="text-bold">${item.likes}</span>
            </div>
            <div class="flex nowrap items-center">
                <i class="fa fa-comment-o cursor-pointer"></i>
                <span class="text-bold">${item.comments}</span>
            </div>
        </div>
    </div>
    </div>
`
}

function genereteColumnsPosts(res){
    const elementPostsBox = document.getElementById('posts-box')
        const column1 = document.createElement('div')
        const column2 = document.createElement('div')
        const column3 = document.createElement('div')

        column1.setAttribute('class','column-posts')
        column2.setAttribute('class','column-posts')
        column3.setAttribute('class','column-posts')

        elementPostsBox.appendChild(column1)
        elementPostsBox.appendChild(column2)
        elementPostsBox.appendChild(column3)

        
        const matrix = {column1:[],column2:[],column3:[]}
        let controller = 1

        res.forEach(item => {
            if(controller === 4) controller = 1

            matrix[`column${controller}`].push(item)

            controller++
        })

        matrix.column1.forEach(item => {
            const post = document.createElement('div')

            post.setAttribute('class','post-single mb-md flex column')

            post.innerHTML = modelPosts(item)

            column1.appendChild(post)
        })

        matrix.column2.forEach(item => {
            const post = document.createElement('div')

            post.setAttribute('class','post-single mb-md flex column')

            post.innerHTML = modelPosts(item)

            column2.appendChild(post)
        })

        matrix.column3.forEach(item => {
            const post = document.createElement('div')

            post.setAttribute('class','post-single mb-md flex column')

            post.innerHTML = modelPosts(item)
            column3.appendChild(post)
        })
}

function loadPosts(){
    const url = 'http://192.168.0.105:5500/data/Posts.json'
    fetch(url).then(res => res.json()).then(res => {{
        state.posts = res
        genereteColumnsPosts(res)
    }})
}


function search(){
    const elementPostsBox = document.getElementById('posts-box')
    elementPostsBox.innerHTML = ''
    const elementSearch = document.getElementById('search')
    const value = elementSearch.value

    if(!!value.trim())  genereteColumnsPosts(state.posts.filter(item => item.name.includes(value.trim()) ||  item.user_name.includes(value.trim())))
    else genereteColumnsPosts(state.posts)
}


function setLike(id) {
   const elementIconBtn = document.getElementById(id)
   if(elementIconBtn.getAttribute('liked')){
    
    elementIconBtn.removeAttribute('class')
    elementIconBtn.setAttribute('class','fa fa-heart-o cursor-pointer')
    elementIconBtn.style.color = 'rgb(130,130,130)'
    elementIconBtn.removeAttribute('liked')
   }

   else{
    elementIconBtn.removeAttribute('class')
    elementIconBtn.setAttribute('class','fa fa-heart cursor-pointer')
    elementIconBtn.style.color = 'rgb(199, 58, 58)'
    elementIconBtn.setAttribute('liked','yes')
   }
  
   
}


window.onload = () => {
    loadMenuLabels()
    loadStories()
    loadPosts()

    addEventListener('click',closeMenuToClickContent)
    addEventListener('scroll',function(e){
        
        if(window.innerWidth > 450) return 
        const app = document.getElementById('app')

        if(window.scrollY  === 0) {
            let padding = 350
            app.style.paddingTop = `${padding}px`

            const time = setInterval(function(){
                app.style.paddingTop = `${padding}px`
                padding-=5
                if(padding <= 0) clearInterval(time)
            },1)
        }
    })
}