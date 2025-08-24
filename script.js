const songsFolder = "http://127.0.0.1:5500/SONGS/";
let currentsong = new Audio();
let currentindex = 0;
let currFolder;
let clickedalbum;
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    return `${mins}:${secs}`;
}

async function getSongs(folder) {
    let res = await fetch(songsFolder + `${folder}`);
    let html = await res.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    let links = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(href => href && href.endsWith(".m4a"))
        .map(file => songsFolder + file);
    return links;
}
const playMusic = (track, pause = false) => {
    let temparr = track.split("/SONGS/");
    let realurl = ""
    for (let i = 0; i < temparr.length; i++) {
        if (temparr[i] == "") {
            realurl += "/SONGS/";
        } else {
            realurl += temparr[i];
        }
    }
    currentsong.src = realurl;
    if (!pause) {
        console.log("current song.src" + currentsong.src);
        currentsong.play();
        play.src = "play.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track.split("/SONGS/")[2]);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function main() {
    let songList = await getSongs("");
    console.log(songList);
    await getSongs("").then(songList => {
        playMusic(songList[0], true);
        let ur = document.querySelector(".playlist").getElementsByTagName("li")[0]
        for (const song of songList) {
            ur.innerHTML = ur.innerHTML + `<li data-url="${song}"> 
                            <img class="invert" src="music.svg">
                            <div class="info">
                                <div class="song_name">  ${decodeURIComponent(song.split(`/SONGS/`)[2])} </div>
                                <div class="artist">Harish</div>
                            </div>
                            <img class="invert" src="play.svg">
        </li>`;
        }
    });
    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.dataset.url);
            play.src = "pause.svg";
        })

    })
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            console.log("Current_song   " + currentsong.src);
            currentsong.play();
            play.src = "pause.svg";

        } else {
            currentsong.pause();
            console.log("current paused   " + currentsong.src);
            play.src = "play.svg";
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    //seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    // click on hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })
    next.addEventListener("click", () => {
        let currentindex = songList.indexOf(currentsong.src.split("/SONGS/")[0] + "/SONGS//SONGS/" + currentsong.src.split("/SONGS/")[1]);
        if (currentindex!=-1 && songList.length > currentindex + 1) {
            playMusic(songList[(++currentindex)], false);
            play.src = "pause.svg";
        }
    })
    previous.addEventListener("click", () => {
        let currentindex = songList.indexOf(currentsong.src.split("/SONGS/")[0] + "/SONGS//SONGS/" + currentsong.src.split("/SONGS/")[1]);
        if (currentindex!=-1 && currentindex - 1 >= 0) {
            playMusic(songList[(currentindex - 1)], false);
            play.src = "pause.svg";
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if(currentsong.volume==0){
            volume.src="mute.svg";
        }else{
            volume.src="volume.svg"
        }
    })
    volume.addEventListener("click",()=>{
        if(currentsong.volume!=0){
            volume.src="mute.svg";
            currentsong.volume=0;
        }else{
            volume.src="volume.svg"
            currentsong.volume=1;
        }
    })
    Array.from(document.getElementsByClassName("card")).forEach(f => {
        f.addEventListener("click", async item => {
            play.src = "play.svg";
            let harish = item.currentTarget.dataset.folder;
            console.log(harish);
            await getSongs(item.currentTarget.dataset.folder).then(songList => {
                console.log(songList);
                playMusic(songList[0], true);
                let ur = document.querySelector(".playlist").getElementsByTagName("li")[0];
                ur.innerHTML = "";
                for (const song of songList) {
                    ur.innerHTML = ur.innerHTML + `<li data-url="${song}"> 
                            <img class="invert" src="music.svg">
                            <div class="info">
                                <div class="song_name">  ${decodeURIComponent(song.split(`/SONGS/`)[2])} </div>
                                <div class="artist">Harish</div>
                            </div>
                            <img class="invert" src="play.svg">
                        </li>`;
                }
                Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(e => {
                    e.addEventListener("click", () => {
                        playMusic(e.dataset.url);
                        play.src = "pause.svg";
                    })
                })
                next.addEventListener("click", () => {
                    console.log("lllllllllll");
                    console.log(currentsong.src);
                    let temparr = currentsong.src.split("/SONGS/");
                    let likearray = temparr[0] + `/SONGS//SONGS/` + temparr[1];
                    console.log("likearray:" + likearray);
                    console.log(songList[0]);
                    let currentindextemp = songList.indexOf(likearray);
                    console.log(currentindextemp);
                    if (songList.length > currentindextemp + 1) {
                        let track = songList[currentindextemp + 1];
                        let boom = false;
                        let temiparr = track.split("/SONGS/");
                        let realurl = "";
                        for (let i = 0; i < temiparr.length; i++) {
                            if (temiparr[i] == "") {
                                realurl += "/SONGS/";
                            } else {
                                realurl += temiparr[i];
                            }
                        }
                        currentsong.src = realurl;
                        if (!boom) {
                            console.log("current song.src" + currentsong.src);
                            currentsong.play();
                            play.src = "play.svg";
                        }
                        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track.split("/SONGS/")[2]);
                        document.querySelector(".songtime").innerHTML = "00:00/00:00";
                        play.src = "pause.svg";
                    }
                })
                previous.addEventListener("click", () => {
                    console.log("lllllllllll");
                    console.log(currentsong.src);
                    let temparr = currentsong.src.split("/SONGS/");
                    let likearray = temparr[0] + `/SONGS//SONGS/` + temparr[1];
                    console.log("likearray:" + likearray);
                    console.log(songList[0]);
                    let currentindextemp = songList.indexOf(likearray);
                    console.log(currentindextemp);
                    if (0 >= currentindextemp - 1) {
                        let track = songList[currentindextemp - 1];
                        let boom = false;
                        let temiparr = track.split("/SONGS/");
                        let realurl = "";
                        for (let i = 0; i < temiparr.length; i++) {
                            if (temiparr[i] == "") {
                                realurl += "/SONGS/";
                            } else {
                                realurl += temiparr[i];
                            }
                        }
                        currentsong.src = realurl;
                        if (!boom) {
                            console.log("current song.src" + currentsong.src);
                            currentsong.play();
                            play.src = "play.svg";
                        }
                        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track.split("/SONGS/")[2]);
                        document.querySelector(".songtime").innerHTML = "00:00/00:00";
                        play.src = "pause.svg";
                    }
                })
            });

        })
    })
}
main();
