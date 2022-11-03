import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  cx
  // css
} from "@emotion/css";

import sty from "./App.module.scss";

import initPic1Path from "./media/i-a.jpg";
import initPic2Path from "./media/i-b.jpg";

import intuitaLogoPath from "./media/intuita-logo.png";
import githubLogoPath from "./media/github-logo.png";

import initVid1Path from "./media/Intuita_Video_A_v3.mp4";
import initVid2Path from "./media/Intuita_Video_B_v3.mp4";

// import initVid1Path from "./media/light-vids/Intuita Video A v3-light.mp4";
// import initVid2Path from "./media/light-vids/Intuita Video B v3-light.mp4";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle
  // ReactCompareSliderImage
} from "react-compare-slider";

export const waitSomeSeconds = async (seconds: number) => {
  const myProm = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });

  return myProm;
};

const glo = {
  vid1:
    // "https://dl.dropboxusercontent.com/sh/sxjdud3ij254h9z/AADiWt7u0EEfUpPM4A4eGL71a/Intuita_Video_A_v3.mp4",
    initVid1Path,

  vid2:
    // "https://dl.dropboxusercontent.com/sh/sxjdud3ij254h9z/AAAoaoWMJh3v3GPyoXYH8SxNa/Intuita_Video_B_v3.mp4",
    initVid2Path,

  vid1_li: `https://dl.dropboxusercontent.com/s/ts6lh11q4d7ug9c/Intuita%20Video%20A%20v3-lightt.mp4`,
  vid2_li: `https://dl.dropboxusercontent.com/s/2opbopee2jd75ab/Intuita%20Video%20B%20v3-light.mp4`,

  iOf1:
    // "https://i.ibb.co/xDW5MP4/i-a.jpg",
    initPic1Path,
  iOf2:
    // "https://i.ibb.co/sCmfz1V/i-b.jpg",
    initPic2Path,

  iconIntuita:
    // "https://i.ibb.co/hMG9qtZ/78830094.png",
    intuitaLogoPath,

  iconGithub:
    // "https://i.ibb.co/Kw77ys0/Git-Hub-logo.png",
    githubLogoPath,

  vid1CanPlay: false,
  vid2CanPlay: false,
  started: false,
  startedFetchingVideos: false
};

const seeShouldBeOptimized = () => {
  const lowerCssPx = Math.min(window.innerWidth, window.innerHeight);

  if (lowerCssPx < 550) {
    return true;
  }

  return false;
};

const loadCoolVideo = (element: HTMLVideoElement, url: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function (oEvent) {
      // @ts-ignore
      const blob = new Blob([oEvent.target.response], {
        type: "video/mp4"
      });

      const blobUrl = URL.createObjectURL(blob);

      // element.src = URL.createObjectURL(blob); // ::-:

      //video.play()  if you want it to play on load
      console.log(blobUrl);
      resolve(blobUrl);
    };

    xhr.onprogress = function (oEvent) {
      if (oEvent.lengthComputable) {
        // const percentComplete = oEvent.loaded / oEvent.total;
        // do something with this
        // console.log("percentComplete:", percentComplete);
      }
    };

    xhr.onerror = function (error) {
      console.log(error);
      reject("error777");
    };

    xhr.send();
  });
};

const App: FunctionComponent = () => {
  const vid1Ref = useRef<HTMLVideoElement | null>(null);
  const vid2Ref = useRef<HTMLVideoElement | null>(null);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!vid1Ref.current || !vid2Ref.current) {
      return;
    }

    if (glo.startedFetchingVideos) {
      return;
    }

    glo.startedFetchingVideos = true;

    console.log("daaaa");

    const shouldBeOptimized = seeShouldBeOptimized();

    const promArr = [
      loadCoolVideo(
        vid1Ref.current,
        // shouldBeOptimized ? glo.vid1_li : glo.vid1
        glo.vid1
      ),
      loadCoolVideo(
        vid2Ref.current,
        // shouldBeOptimized ? glo.vid2_li : glo.vid2
        glo.vid2
      )
    ];

    Promise.all(promArr)
      .then(async (urlArr) => {
        const qqq = urlArr as string[];
        console.log("both finished");

        if (!vid1Ref.current || !vid2Ref.current) {
          return;
        }

        vid1Ref.current.src = qqq[0];
        vid2Ref.current.src = qqq[1];

        await waitSomeSeconds(0.7);

        // vid1Ref.current.currentTime = 0.08;
        // vid2Ref.current.currentTime = 0.08;

        try {
          vid2Ref.current.play();
          vid2Ref.current.pause();

          vid1Ref.current.play();
          vid1Ref.current.pause();
        } catch (err) {
          alert(`error at pre-start: ${(err as any).message}`);
          console.log(err);
        }

        await waitSomeSeconds(0.5);

        setShowIntro(false);

        await waitSomeSeconds(1.2);

        try {
          vid2Ref.current.play();
          vid1Ref.current.play();

          // vid1Ref.current.poster = undefined;
          // vid2Ref.current.poster = undefined;
        } catch (err) {
          alert(`error at start: ${(err as any).message}`);
          console.log(err);
        }

        // vid1Ref.current.autoplay = true;
      })
      .catch((err) => {
        console.log(err);
      });

    //---
  }, []);

  const myDuo = useMemo(() => {
    const arr = [
      { ref: vid1Ref, iOf: glo.iOf1, vi: glo.vid1_li },
      { ref: vid2Ref, iOf: glo.iOf2, vi: glo.vid2_li }
    ];

    const elArr = arr.map((item, index) => {
      const cl_showIntro = showIntro ? sty.showIntro : "";

      return (
        <div key={index} style={{ width: "100%" }}>
          <img
            className={cx(sty.introImg, cl_showIntro)}
            alt={"intro"}
            src={item.iOf}
            style={{ width: "100%", objectFit: "cover" }}
          />

          <video
            className={cx(sty.theVid, cl_showIntro)}
            preload="none"
            // autoPlay
            muted
            playsInline
            width="100%"
            height="100%"
            // controls
            loop
            ref={item.ref}
            // poster={item.iOf}

            // src={
            //   "https://dl.dropboxusercontent.com/s/ts6lh11q4d7ug9c/Intuita%20Video%20A%20v3-lightt.mp4"
            // }
            style={{ width: "100%", objectFit: "cover" }}
          >
            {/* <source
              // src={
              //   "https://dl.dropboxusercontent.com/s/ts6lh11q4d7ug9c/Intuita%20Video%20A%20v3-lightt.mp4"
              // }
              type="video/mp4"
            /> */}
            Your browser does not support the video tag.
          </video>
        </div>
      );
    });

    return elArr;
  }, [showIntro]);

  return (
    <div
      className="App"
      // onClick={() => {
      //   try {
      //     if (!showIntro) {
      //       vid1Ref.current.play();
      //       vid2Ref.current.play();
      //     }
      //   } catch (err) {
      //     alert(err);
      //     console.log(err);
      //   }
      // }}
      style={{ width: "100%" }}
    >
      {/* <h1>Hello Intuita</h1> */}

      <div className={cx(sty.coolBoxWrap)} style={{ width: "100%" }}>
        <a
          className={cx(sty.absoBox)}
          href="https://github.com/intuita-inc/"
          target="_black"
        >
          <img
            className={cx(sty.imgIntuita)}
            alt="intuita"
            src={glo.iconIntuita}
          />
          <img
            className={cx(sty.imgGithub)}
            alt="github"
            src={glo.iconGithub}
          />
        </a>

        <ReactCompareSlider
          className={cx(sty.coolBox)}
          itemOne={myDuo[0]}
          itemTwo={myDuo[1]}
          changePositionOnHover={true}
          style={{ width: "100%" }}
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                display: "none",
                backdropFilter: undefined,
                background: "white",
                border: 0,
                color: "#333"
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default App;
