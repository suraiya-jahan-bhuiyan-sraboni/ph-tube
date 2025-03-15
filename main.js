console.log("hello from console main js")

function getCategories() {
    //fetching categories from api
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            data.categories.forEach(element => {
                let categories = document.getElementById('categories')
                let btn = categories.appendChild(document.createElement('button'))
                btn.classList.add('btn', 'btn-soft', 'hover:bg-[#FF1F3D]', 'hover:text-white');
                btn.innerText = `${element.category}`;
                btn.onclick = () => {
                    const activeButtons = document.getElementsByClassName("active");
                    for (let btnn of activeButtons) {
                        btnn.classList.remove("active");
                    }
                    // console.log(`Category clicked: ${element.category}`);
                    btn.classList.add("active");
                    document.getElementById('videos-container')
                        .innerHTML = `<section class="col-span-4 w-[50%] mx-auto text-center">
                        <span class="loading loading-spinner text-secondary "></span>
                        </section>`;
                    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${element.category_id}`)
                        .then(res => res.json())
                        .then(data => {
                            //console.log(data.category)
                            displayVideo(data.category)

                        })
                }
            })

        })
}

/* fetching all videos and based on search  */

function loadAllVideos(searchText = "") {
    document.getElementById('videos-container')
        .innerHTML = `<section class="col-span-4 w-[50%] mx-auto text-center">
        <span class="loading loading-spinner text-secondary "></span>
        </section>`;
    const activeButtons = document.getElementsByClassName("active");
    for (let btnn of activeButtons) {
        btnn.classList.remove("active");
    }
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => {
            displayVideo(data.videos)
        })
    document.getElementById('AllBtn').classList.add("active");
}

//displaying videos

function displayVideo(videos) {
    //  console.log(videos)
    let videos_container = document.getElementById('videos-container');
    videos_container.innerHTML = "";
    if (videos.length == 0) {
        videos_container.innerHTML = `
        <div
        class="py-20 col-span-full flex flex-col justify-center items-center text-center"
      >
        <img class="w-[120px]" src="res/Icon.png" alt="" />
        <h2 class="text-2xl font-bold">
          Oops!! Sorry, There is no content here
        </h2>
      </div>
        
        `
    }

    videos.forEach(element => {
        // console.log(element)
        const seconds = element.others.posted_date;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        let formattedDate;
        if (hours >= 12) {
            formattedDate = 'few month ago';
        } else {
            formattedDate = `${hours}h ${minutes}m ago`;
        }

        const videov = document.createElement('div')
        videov.innerHTML = `
            <div class="card bg-base-100 ">
                <div class="relative">
                    <figure>
                        <img class="rounded-lg object-cover w-full h-[150px] "
                            src="${element.thumbnail}" />
                            ${element.others.posted_date ?
                '<span class="text-white bg-[#171717]  text-xs absolute bottom-2 right-3 px-2 py-1">'
                + formattedDate + '</span>' : ' '}           
                    </figure>
                </div>

                <div class="card-body flex flex-row items-start gap-3 px-0">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                            <img src="${element.authors[0].profile_picture}" />
                        </div>
                    </div>
                    <div>
                        <h2 class="card-title text-sm">${element.title}</h2>
                        <p class="text-xs py-2 text-gray-400 ">${element.authors[0].profile_name}
                        ${element.authors[0].verified ? '<span class="text-blue-600"><i class="ri-verified-badge-fill"></i></span>' : ''}
                        </p>
                        <p class="text-xs text-gray-400">${element.others.views} views</p>
                    </div>

                </div>
                <button class="btn" onclick="loadVideoDetails('${element.video_id}')">View Details</button>
            </div>
         
        `
        videos_container.appendChild(videov)
    });
}

//modal

function loadVideoDetails(videoId) {
    //   console.log(videoId)
    fetch(` https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("my_modal_2").showModal();
            const detailsContainer = document.getElementById("details-container");
            detailsContainer.innerHTML = `
 <div class="card bg-base-100 w-96 shadow-sm mx-auto">
  <figure class="px-10 pt-10">
    <img
      src="${data.video.thumbnail}"
      alt="Shoes"
      class="rounded-xl" />
  </figure>
  <div class="card-body items-center text-center">
    <h2 class="card-title">${data.video.title}</h2>
    <p>${data.video.description}</p>
    <div class="card-actions">
      <button class="btn btn-primary">Watch</button>
    </div>
  </div>
</div>
            
            `
        })
}

//search functionality

document.getElementById("search").addEventListener('keyup', e => {
    loadAllVideos(e.target.value)
});


loadAllVideos()
getCategories()