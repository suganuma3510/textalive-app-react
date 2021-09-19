import { type } from "os";
import React, { useEffect, useState, createRef, useMemo } from "react";
import { Player } from "textalive-app-api";

import { PlayerControl } from "./PlayerControl";

const defaultFontSize = 10;
const defaultColor = "#000";

const sansSerif = `"Hiragino Kaku Gothic Pro", "游ゴシック体", "Yu Gothic", YuGothic, Meiryo, HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif`;
const serif = `"Times New Roman", YuMincho, "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif`;

export const Body = () => {

  const [player, setPlayer] = useState<Player | null>(null);
  const [app, setApp] = useState<any | null>(null);
  const [char, setChar] = useState("");
  const [fontFamily, setFontFamily] = useState(sansSerif);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [color, setColor] = useState(defaultColor);
  const [darkMode, setDarkMode] = useState(false);
  const [mediaElement, setMediaElement] = useState<HTMLElement | string | null>(null);

  const div = useMemo(() => <div className="media" ref={setMediaElement} />, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mediaElement) {
      return;
    }
    const el = document.querySelector<HTMLElement>('.char')

    console.log("--- [app] create Player instance ---");
    const p = new Player({
      app: {
        token: "jitZJDSOlKS4ETfu",
        appName: "Params example",
        appAuthor: "Jun Kato",
        parameters: [
          {
            title: "フォントの種類",
            name: "fontFamily",
            className: "Select",
            params: [
              [serif, "明朝体"],
              [sansSerif, "ゴシック体"],
            ],
            initialValue: sansSerif,
          },
          {
            title: "フォントサイズ",
            name: "fontSize",
            className: "Slider",
            params: [0, 100],
            initialValue: defaultFontSize,
          },
          {
            title: "テキスト色",
            name: "color",
            className: "Color",
            initialValue: defaultColor,
          },
          {
            title: "ダークモード",
            name: "darkMode",
            className: "Check",
            initialValue: false,
          },
        ],
      },
      mediaElement,
    });

    const playerListener = {
      onAppReady: (app: any) => {
        console.log("--- [app] initialized as TextAlive app ---");
        console.log("managed:", app.managed);
        console.log("host:", app.host);
        console.log("song url:", app.songUrl);
        if (!app.songUrl) {
          p.createFromSongUrl("http://www.youtube.com/watch?v=bMtYf3R0zhY");
        }
        setApp(app);
      },
      onAppParameterUpdate: (name: string, value: any) => {
        console.log(`[app] parameters.${name} update:`, value);
        if (name === "fontFamily") {
          setFontFamily(value);
        }
        if (name === "fontSize") {
          setFontSize(value);
        }
        if (name === "color") {
          const color = value;
          setColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
        }
        if (name === "darkMode") {
          setDarkMode(!!value);
        }
      },
      onVideoReady: () => {
        console.log("--- [app] video is ready ---");
        console.log("player:", p);
        console.log("player.data.song:", p.data.song);
        console.log("player.data.song.name:", p.data.song.name);
        console.log("player.data.song.artist.name:", p.data.song.artist.name);
        console.log("player.data.songMap:", p.data.songMap);
        let c = p.video.firstPhrase;
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.startTime <= now && u.endTime > now) {
              setChar(u.text);
            }
          };
          c = c.next;
        }
      },
    };
    p.addListener(playerListener);

    setPlayer(p);
    return () => {
      console.log("--- [app] shutdown ---");
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
      <div
        className="wrapper"
        style={{
          backgroundImage: 'url("https://img.youtube.com/vi/bMtYf3R0zhY/maxresdefault.jpg")',
          backgroundSize: "cover",
        }}
      >
        <div
          className="char"
          style={{
            fontFamily,
            fontSize: `${fontSize}vh`,
            color,
          }}
        >
          {char}
        </div>
      </div>
      {div}
    </>
  );
};