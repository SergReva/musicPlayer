(function IIFE() {

    let list = [],
    link;   

    function getData() {
        getVersion();
        const req = new XMLHttpRequest();
        req.open('GET', link);
        req.setRequestHeader('accept', 'application/json');
        req.addEventListener("readystatechange", () => {

            if (req.readyState === 4 && req.status === 200) {
                list = JSON.parse(req.responseText);
                // list.sort(sortList);
                writeData(list);
                localStorage.getItem("NID") ? currentId = +localStorage.getItem("NID") : currentId = 0;
                init();

                if (localStorage.getItem("TIME")) {
                    document.getElementById(currentAudio).currentTime = +localStorage.getItem("TIME");
                    localStorage.removeItem("TIME");
                }

                playAfter();
                document.getElementById(currentAudio).volume = (slider.value / 100);
                console.log('Init seccesfule');
            }
        });
        req.send();
    }
    getData();

    function sortList (a,b) {
        return Math.random() - 0.5
    }

    function writeData(a) {
        localStorage.setItem("List", JSON.stringify(a));
    }

    function readData(list) {
        return list = localStorage.getItem("List");
    }

    function clearData() {
        localStorage.removeItem("NID");
        location.reload(true);
    }

    function fetchData() {
        getVersion();
        fetch(link)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            readData();
            if (data.length !== list.length) {
                if (currentId < list.length) {
                    clearData();
                }
                list = data;
                writeData(list);
                if (list[currentId].author === "MUSIC") {
                    localStorage.setItem("TIME", document.getElementById(currentAudio).currentTime);
                    location.reload(true);
                }
                location.reload(true);
            }
        });
    }

    function playAfter() {
        playBtn.classList.add("_pause");
        playBtn.classList.remove("_play");
        albumWrap.classList.add("_pause");
        albumWrap.classList.remove("_play");
        isPlaying = true;
        showTime();
        mediaType();
        fetchTimer = setInterval(fetchData, timeT);
        // localStorage.removeItem("List");
    }

    function getVersion() {
        let linkVersion = Math.floor(new Date());
        link = "list.json?" + linkVersion;

        return link;
    }

    let currentId = 0,
     isPlaying = false,
     isLoop = true,
     loopOne = false,
     isShuffle = false,
     currentAudio = "music1",
     timer = null,
     playTimer = null,
     fetchTimer = null,
     time = 5400000,
     timeT = 120000;

    const albumWrap = document.querySelector(".album"),
     currentTimeIndicator = document.querySelector(".musicTime__current"),
     leftTimeIndicator = document.querySelector(".musicTime__last"),
     progressBar = document.getElementById("length"),
     title = document.querySelector(".musicInfo__name"),
     author = document.querySelector(".musicInfo__author"),
     albumClass = document.getElementById("jsAlbum"),
     playBtn = document.getElementById("play"),
     loopBtn = document.getElementById("loop"),
     shuffleBtn = document.getElementById("shuffle"),
     prevBtn = document.getElementById("prev"),
     nextBtn = document.getElementById("next"),
     progressDiv = document.getElementById("progress"),

     favorIcon = document.getElementById("fav"),
     favorBlock = document.querySelector(".fav"),
     favorText = document.querySelector(".fav-text"),
     favorClose = document.querySelector(".fav-close"),
     favorClear = document.querySelector(".clear"),
     favorOpen = document.querySelector(".fav-open"),
     sModal = document.querySelector(".s-modal"),
     gUrl = document.querySelector(".srch"),

     slider = document.getElementById("myRange");     
// volume

    slider.onchange = function() {
        document.getElementById('music1').volume = (this.value / 100);
    }

// favorite 

    if (!localStorage.getItem("Fav")) {
        localStorage.setItem("Fav", "");
        var favList = []; 
    }
    function addFav() {

        b = JSON.parse(localStorage.getItem("List"));
        let favItem = {
            "url" : b[currentId].url,
            "title" : b[currentId].title,
            "id" : currentId
        };

        localStorage.getItem("Fav").length == 0 ? favList = [] : favList = JSON.parse(localStorage.getItem("Fav"));

        favList.push(favItem);
        localStorage.setItem("Fav", JSON.stringify(favList));
    }

    function renderText(x,y,z) {
        a = JSON.parse(localStorage.getItem(y));
        b = 0;
        a.forEach((i)=> {
            if (y === 'Fav') {
                x.innerHTML += `
                    <p data-url = "${i.url}" id = "track"  data-id = ${b}>${+i.id + 1}.  ${i.title}</p>
                `;
            } else {
                x.innerHTML += `
                    <p data-url = "${i.url}" id = "track"  data-id = ${b}>${z}.  ${i.title}</p>
                `;
            }
            b++;
            z++;
        });

    }

    favorIcon.addEventListener("click", addFav);

    favorOpen.addEventListener("click", () => {
        renderText(favorText, 'Fav', 1);
        favorBlock.style.display = "block";
    });

    favorClose.addEventListener("click", () => {
        favorBlock.style.display = "none";
        favorText.innerHTML = "";
    });

    favorBlock.addEventListener("click", (e) => {
        e = e.target;
        if (e.id == "track") {
            document.getElementById("music1").src = e.dataset.url;
            title.innerHTML = e.innerHTML;
            playAfter();
        }
    });

    favorClear.addEventListener("click", () => {
        favorText.innerHTML = "";
        localStorage.removeItem("Fav");
        location.reload(true);
    });

    title.addEventListener('dblclick', () => {
        sModal.innerHTML = `Найти песню: <br/> <a target="_blanck" href="https://www.google.com/search?q=${title.innerHTML} скачать" class="srch">${title.innerHTML}</a>`;
        sModal.style.display = "block";
    });

    sModal.addEventListener('click', (e) => {
        sModal.style.display = "none";
        e = e.target;
        if (e.tagName !== "A") {
            sModal.style.display = "none";
        }
        console.dir(e)
    });


//MEDIA TYPE
    function mediaType() {
        if (list[currentId].author !== "MUSIC") {
            playTimer = setTimeout(() => goToNextMusic(), time);
        }
    }

//keyborad
document.addEventListener('keydown', (e) => {
    let a = document.getElementById(currentAudio);
    
    //PLAY\PAUSE
    if (e.code === 'Space') {
        if (a.paused) {
            a.play();
            play();
            playBtn.classList.remove("_play");
        } else {
            a.pause();
            playBtn.classList.remove("_play");
            play();
        }
    }

    //SWITCH TARCK
    if (e.code === "KeyX") {
        nextMusic("next");
    } else if (e.code === "KeyZ") {
        nextMusic("prev");
    }

    // VOLUME CHANGE
    if (e.code === "ArrowUp" && (e.ctrlKey || e.metaKey)) {
        a.volume < 0.97 ? a.volume += 0.02 : a.volume = 1;
        slider.valueAsNumber = a.volume * 100;
        console.log(a.volume)
    } else if (e.code === "ArrowDown" && (e.ctrlKey || e.metaKey)) {
        a.volume > 0.03 ? a.volume -= 0.02 : a.volume = 0;
        slider.valueAsNumber = a.volume * 100;
        console.log(a.volume)
    }
})


// BUTTON PLAY
    function play(e) { 
        if (!isPlaying) {
            if (e) {
                e.target.classList.remove("_play");
                e.target.classList.add("_pause");
            } else {
                playBtn.classList.remove("__play");
                playBtn.classList.add("_pause");
            }

            albumWrap.classList.remove("_play");
            albumWrap.classList.add("_pause");
            isPlaying = true;
            document.getElementById(currentAudio).play();
            showTime();
            mediaType();
            fetchTimer = setInterval(fetchData, timeT);

        } else {
            if (e) {
                e.target.classList.remove("_pause");
                e.target.classList.add("_play");
            } else {
                playBtn.classList.remove("_pause");
                playBtn.classList.add("_play");
            }

            albumWrap.classList.remove("_pause");
            albumWrap.classList.add("_play");
            isPlaying = false;
            document.getElementById(currentAudio).pause();
            clearInterval(timer);
            clearTimeout(playTimer);
            clearInterval(fetchTimer);
        }
    }

// TIME
    function changeBar() {
        const audio = document.getElementById(currentAudio);
        const percentage = (audio.currentTime / audio.duration).toFixed(3);
        progressBar.style.transition = "";
    //set current time
        const minute = Math.floor(audio.currentTime / 60);
        const second = Math.floor(audio.currentTime % 60);
        const leftTime = audio.duration - audio.currentTime;
        currentTimeIndicator.innerHTML = ("0" + minute).substr(-2) + ":" + ("0" + second).substr(-2);

    //set left time
        const leftMinute = Math.floor(leftTime / 60);
        const leftSecond = Math.floor(leftTime % 60);
        leftTimeIndicator.innerHTML = ("0" + leftMinute).substr(-2) + ":" + ("0" + leftSecond).substr(-2);
    //set time bar
        progressBar.style.width = percentage * 100 + "%";
        // console.log("current time is ==>>> -_- " + audio.currentTime + " -_-");
    }

    function showTime() {
        timer = setInterval(() => changeBar(), 500);
    }

// SWITCHING MUSIC
    function nextMusic(mode) {

        clearInterval(timer);
        clearTimeout(playTimer);
        clearInterval(fetchTimer);
        playAfter();

        if (mode === "next") {
            currentId === list.length - 1 ? currentId = 0 : currentId++;
            init();

        } else {
            let g = currentId--;
            g - 1 < 0 ? currentId = list.length - 1 : g;
            init();
        }
        localStorage.setItem("NID", currentId);
    }

// STARTING A RANDOM TRACK
    function shuffle(e) {
        isShuffle = !isShuffle;
        if (isShuffle) {
            e.target.classList.add("_shuffle");
        } else {
            e.target.classList.remove("_shuffle");
        }
    }

// STOP MUSIC
    function stopMusic() {
        playBtn.classList.add("_play");
        albumWrap.classList.add("_play");
        isPlaying = false;
        clearInterval(fetchTimer);
    }

// THE START OF THE NEXT TRACK
    function goToNextMusic() {
         
        let newId = currentId;

        while (isShuffle && !loopOne && newId === currentId) {
            newId = Math.floor(Math.random() * Math.floor(list.length - 1));
        }

        if (!isShuffle && !loopOne) {
            currentId === list.length - 1 ? currentId = 0 : currentId++;
        }

        if (!isShuffle && loopOne) {
            currentId = currentId;
        }

        if (isShuffle) {
            currentId = newId;
        }
        localStorage.setItem("NID", currentId);
        init();
        mediaType();
        document.getElementById(currentAudio).play();
    }

// THE PLAYBACK MODE OF THE TRACK
    function loop(e) {
        const audio = document.getElementById(currentAudio);

        if (!isLoop && !loopOne) {
            isLoop = true;
            loopOne = false;
            e.target.classList.remove("_off");
            e.target.classList.add("_loop");
            audio.loop = false;
            audio.onended = e => goToNextMusic();
            console.log(isLoop, loopOne);

        } else if (isLoop && !loopOne) {
            isLoop = true;
            loopOne = true;
            e.target.classList.remove("_loop");
            e.target.classList.add("_repeat");
            audio.loop = true;
            audio.onended = e => goToNextMusic();
            console.log(isLoop, loopOne);

        } else {
            isLoop = false;
            loopOne = false;
            e.target.classList.remove("_repeat");
            e.target.classList.add("_off");
            audio.loop = false;
            audio.onended = e => stopMusic();
            console.log(isLoop, loopOne);
        }
    }

// PROGRESS 
    function progress(e) {
        const audio = document.getElementById(currentAudio);
        const pos = (e.pageX - progressDiv.getClientRects()[0].x) / progressDiv.getClientRects()[0].width;
        audio.currentTime = pos * audio.duration;
        changeBar();
    }

    function init() {
        const audio = document.getElementById(currentAudio) === null ? new Audio() : document.getElementById(currentAudio);

        list.length < localStorage.getItem("NID") ? clearData() : "";
        audio.src = list[currentId].url;
        audio.id = currentAudio;
        audio.autoplay = true;
        document.getElementById(currentAudio) === null ? document.body.appendChild(audio) : "";
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        document.getElementById(currentAudio).currentTime = 0;
        albumClass.classList = (list[currentId].class);
        let newId = currentId + 1;
        title.innerHTML = newId + '.  ' + list[currentId].title;
        author.innerHTML = list[currentId].author;

        //set current time

        audio.addEventListener("loadedmetadata", function() {
            const leftMinute = Math.floor(audio.duration / 60);
            const leftSecond = Math.floor(audio.duration % 60);
            currentTimeIndicator.innerHTML = "00:00";
            leftTimeIndicator.innerHTML = ("0" + leftMinute).substr(-2) + ":" + ("0" + leftSecond).substr(-2);
            progressBar.style.transition = "";
        });
        document.getElementById(currentAudio).onended = e => goToNextMusic(e);
    }
    playBtn.addEventListener("click", play);
    loopBtn.addEventListener("click", loop);
    shuffleBtn.addEventListener("click", shuffle);
    prevBtn.addEventListener("click", e => nextMusic("prev"));
    nextBtn.addEventListener("click", e => nextMusic("next"));
    progressDiv.addEventListener("click", e => {
        progress(e);
    });


//playLIST
    const playList = document.querySelector(".playList"),
    listText = document.querySelector(".playList-text"),
    listClose = document.querySelector(".playList-close");
    listOpen = document.querySelector(".playList-open");

    listOpen.addEventListener("click", () => {
        renderText(listText, 'List', 1);
        playList.style.display = "block";
    });

    listClose.addEventListener("click", () => {
        playList.style.display = "none";
        listText.innerHTML = "";
    });

    playList.addEventListener('click', (e) => {
        e = e.target;
        if (e.id == "track") {
            document.getElementById("music1").src = e.dataset.url;
            currentId = e.dataset.id;
            localStorage.setItem("NID", e.dataset.id);
            title.innerHTML = e.innerHTML;
            playAfter();
        }
    });

//shufle List
function shuffleList () {
    for (let i = list.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [list[i], list[j]] = [list[j], list[i]];
      }
}
})();