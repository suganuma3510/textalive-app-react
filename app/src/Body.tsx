import React, { useEffect, useState, createRef, useMemo } from "react";
import { Player } from "textalive-app-api";
import { PlayerControl } from "./PlayerControl";
import GlitchedWriter, { wait, presets, queueWrite } from "glitched-writer";

export const Body = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [app, setApp] = useState<any | null>(null);
  const [char, setChar] = useState<string[]>([]);
  const [credit, setCredit] = useState([
    "First Note",
    "Music/Lyrics: blues",
    "Vocal: Miku",
  ]);
  const [mediaElement, setMediaElement] = useState<HTMLElement | string | null>(
    null
  );
  const div = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );
  const envInfo = {
    API_KEY: process.env.API_KEY || "apikey",
    APP_NAME: process.env.APP_NAME || "Glitch lyrics writer",
    APP_AUTHOR: process.env.APP_AUTHOR || "Suganuma3510",
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mediaElement) {
      return;
    }
    const charEl = document.querySelector<HTMLElement>(".char");
    const creditEl = document.querySelector<HTMLElement>(".credit");

    const p = new Player({
      app: {
        token: envInfo.API_KEY,
        appName: envInfo.APP_NAME,
        appAuthor: envInfo.APP_AUTHOR,
      },
      mediaElement,
    });

    const charWriter = new GlitchedWriter(
      charEl,
      { ...presets.neo, letterize: true },
      toString
    );
    const creditWriter = new GlitchedWriter(
      creditEl,
      { ...presets.neo, letterize: true },
      toString
    );

    const playerListener = {
      onAppReady: (app: any) => {
        if (!app.songUrl) {
          p.createFromSongUrl("https://piapro.jp/t/FDb1/20210213190029", {
            video: {
              // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
              beatId: 3953882,
              repetitiveSegmentId: 2099561,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
              lyricId: 52065,
              lyricDiffId: 5093,
            },
          });
        }
        setApp(app);
      },
      onVideoReady: () => {
        let c = p.video.firstPhrase;
        creditWriter.queueWrite(credit, 8000, true);
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.startTime <= now && u.endTime > now) {
              let isNextPhrase: boolean = false;

              setChar((char) => {
                if (char[0] != u.text) {
                  isNextPhrase = true;
                }
                return [u.text];
              });
              if (isNextPhrase) {
                charWriter.write(u.text);
              }
            }
          };
          c = c.next;
        }
      },
    };
    p.addListener(playerListener);

    setPlayer(p);
    return () => {
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [mediaElement]);

  return (
    <>
      {player && app && (
        <div className="controls">
          <PlayerControl disabled={app.managed} player={player} />
        </div>
      )}
      <div className="wrapper">
        <div className="char"></div>
      </div>
      <div className="credit"></div>
      {div}
    </>
  );
};
