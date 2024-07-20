console.log("js start");
playsvg = document.querySelector(".playsvg");
song_info = document.querySelector(".song-info");
song_time = document.querySelector(".song-time");
circle = document.querySelector(".circle");
seekbar = document.querySelector(".seekbar");
menu = document.querySelector(".menu");
left = document.querySelector(".left");
cross = document.querySelector(".cross");
previous = document.querySelector(".previoussvg");
next = document.querySelector(".nextsvg");
inputrange = document.querySelector(".inputrange");
card = document.getElementsByClassName("card");
cardContainer = document.querySelector(".cardContainer");
volume_svg=document.querySelector(".volume_svg")
mute_svg=document.querySelector(".mute_svg")
// http://127.0.0.1:5500/spotify_clone/songs/
let present_song = new Audio(); //Global var//
let songs;
let present_folder;

// time function
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// get songs function
async function getsongs(folder) {
  present_folder = folder;
  let a = await fetch(`/spotify_clone/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let idx = 0; idx < as.length; idx++) {
    let element = as[idx];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let song_ol = document
    .querySelector(".song-list")
    .getElementsByTagName("ol")[0];
  song_ol.innerHTML = "";
  for (const song of songs) {
    song_ol.innerHTML =
      song_ol.innerHTML +
      ` <li>
                          <img class="invert" src="images/music.svg" alt="">
                          <div class="info">
                              <div>${song.replaceAll("%20", " ")}</div>
                              <div>K-Drama ost</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img  class="invert" src="images/play.svg" alt="">
                          </div>
                      </li>`;
  }

  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs
}

// playMusic function
const playMusic = (track, pause = false) => {
  present_song.src = `${present_folder}/` + track;
  playsvg.src = "images/play.svg";
  if (!pause) {
    present_song.play();
    playsvg.src = "images/pause.svg";
  }

  // present_song.play();
  // playsvg.src = "images/pause.svg";
  song_info.innerHTML = track;
  song_time.innerHTML = "00:00 / 00:00";
};

async function displayAlbume() {
  let a = await fetch(`/spotify_clone/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let folders=[]
  let array = Array.from(anchor);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes(`/songs`) && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-1)[0];
      // console.log(folder)
    }
  }
  
}
// main function
async function main() {
  await getsongs("songs/BTS");
  playMusic(songs[0], true);
  // console.log(songs);

  await displayAlbume();

  playsvg.addEventListener("click", () => {
    if (present_song.paused) {
      present_song.play();
      playsvg.src = "images/pause.svg";
    } else {
      present_song.pause();
      playsvg.src = "images/play.svg";
    }
  });
  present_song.addEventListener("timeupdate", () => {
    // console.log(present_song.currentTime, present_song.duration);
    song_time.innerHTML = `${secondsToMinutesSeconds(present_song.currentTime)}
    :${secondsToMinutesSeconds(present_song.duration)}`;
    circle.style.left =
      (present_song.currentTime / present_song.duration) * 100 + "%";
  });
  seekbar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percent + "%";
    present_song.currentTime = (present_song.duration * percent) / 100;
  });

  menu.addEventListener("click", () => {
    left.style.left = "0";
  });
  cross.addEventListener("click", () => {
    left.style.left = "-200%";
  });

  previous.addEventListener("click", () => {
    // console.log("previous-song");
    let index = songs.indexOf(present_song.src.split("/").slice(-1)[0]);
    // console.log(index);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    // console.log("next-song");
    let index = songs.indexOf(present_song.src.split("/").slice(-1)[0]);
    // console.log(index);
    if (index + 1 <= songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });


  inputrange.addEventListener("change", (e) => {
    // console.log("volume:", e.target.value);
    present_song.volume = parseInt(e.target.value) / 100;
  });

  volume_svg.addEventListener("click",(e)=>{
    // console.log( e.target.src)
    if(e.target.src.includes("images/volume.svg")){
      e.target.src=e.target.src.replace("images/volume.svg","images/mute.svg");
      // console.log( e.target.src)
      present_song.volume=0;
    }
    else{
      e.target.src=e.target.src.replace("images/mute.svg","images/volume.svg");
      present_song.volume= .50;
    }
  
  })
  
  Array.from(card).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset);
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0],true)
    });
   });
}
main();
