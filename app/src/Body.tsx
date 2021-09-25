import React, { useEffect, useState, createRef, useMemo } from "react";
import { Player } from "textalive-app-api";
import { PlayerControl } from "./PlayerControl";
import GlitchedWriter, { wait, presets, queueWrite } from "glitched-writer";
import Particles from "react-tsparticles";

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
      { ...presets.neo, changeChance: 2, letterize: true },
      toString
    );
    const creditWriter = new GlitchedWriter(
      creditEl,
      { ...presets.neo, changeChance: 2, letterize: true },
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
      <div className="background-animation">
        <Particles
          id="tsparticles"
          options={{
            autoPlay: true,
            backgroundMask: {
              composite: "destination-out",
              cover: {
                color: {
                  value: "#fff",
                },
                opacity: 1,
              },
              enable: false,
            },
            fullScreen: {
              enable: true,
              zIndex: 1,
            },
            detectRetina: true,
            duration: 0,
            fpsLimit: 60,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "connect",
                  parallax: {
                    enable: false,
                    force: 60,
                    smooth: 10,
                  },
                },
                resize: true,
              },
              modes: {
                attract: {
                  distance: 200,
                  duration: 0.4,
                  factor: 1,
                  maxSpeed: 50,
                  speed: 1,
                },
                bubble: {
                  distance: 400,
                  duration: 2,
                  mix: false,
                  opacity: 0.8,
                  size: 40,
                },
                connect: {
                  distance: 80,
                  links: {
                    opacity: 0.5,
                  },
                  radius: 60,
                },
                grab: {
                  distance: 400,
                  links: {
                    blink: false,
                    consent: false,
                    opacity: 1,
                  },
                },
                light: {
                  area: {
                    gradient: {
                      start: {
                        value: "#ffffff",
                      },
                      stop: {
                        value: "#000000",
                      },
                    },
                    radius: 1000,
                  },
                  shadow: {
                    color: {
                      value: "#000000",
                    },
                    length: 2000,
                  },
                },
                push: {
                  default: true,
                  groups: [],
                  quantity: 4,
                },
                remove: {
                  quantity: 2,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                  factor: 100,
                  speed: 1,
                  maxSpeed: 50,
                },
                slow: {
                  factor: 3,
                  radius: 200,
                },
                trail: {
                  delay: 1,
                  pauseOnStop: false,
                  quantity: 1,
                },
              },
            },
            manualParticles: [],
            motion: {
              disable: false,
              reduce: {
                factor: 4,
                value: true,
              },
            },
            particles: {
              bounce: {
                horizontal: {
                  random: {
                    enable: false,
                    minimumValue: 0.1,
                  },
                  value: 1,
                },
                vertical: {
                  random: {
                    enable: false,
                    minimumValue: 0.1,
                  },
                  value: 1,
                },
              },
              collisions: {
                bounce: {
                  horizontal: {
                    random: {
                      enable: false,
                      minimumValue: 0.1,
                    },
                    value: 1,
                  },
                  vertical: {
                    random: {
                      enable: false,
                      minimumValue: 0.1,
                    },
                    value: 1,
                  },
                },
                enable: false,
                mode: "bounce",
                overlap: {
                  enable: true,
                  retries: 0,
                },
              },
              color: {
                value: "random",
                animation: {
                  h: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  s: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  l: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                },
              },
              destroy: {
                split: {
                  count: 1,
                  factor: {
                    random: {
                      enable: false,
                      minimumValue: 0,
                    },
                    value: 3,
                  },
                  rate: {
                    random: {
                      enable: false,
                      minimumValue: 0,
                    },
                    value: {
                      min: 4,
                      max: 9,
                    },
                  },
                  sizeOffset: true,
                },
              },
              gradient: [],
              groups: {},
              life: {
                count: 0,
                delay: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 0,
                  sync: false,
                },
                duration: {
                  random: {
                    enable: false,
                    minimumValue: 0.0001,
                  },
                  value: 0,
                  sync: false,
                },
              },
              links: {
                blink: false,
                color: {
                  value: "#ffffff",
                },
                consent: false,
                distance: 150,
                enable: false,
                frequency: 1,
                opacity: 0.4,
                shadow: {
                  blur: 5,
                  color: {
                    value: "#00ff00",
                  },
                  enable: false,
                },
                triangles: {
                  enable: false,
                  frequency: 1,
                },
                width: 1,
                warp: false,
              },
              move: {
                angle: {
                  offset: 0,
                  value: 90,
                },
                attract: {
                  distance: 200,
                  enable: false,
                  rotate: {
                    x: 600,
                    y: 1200,
                  },
                },
                decay: 0,
                distance: {},
                direction: "none",
                drift: 0,
                enable: true,
                gravity: {
                  acceleration: 9.81,
                  enable: false,
                  inverse: false,
                  maxSpeed: 50,
                },
                path: {
                  clamp: true,
                  delay: {
                    random: {
                      enable: false,
                      minimumValue: 0,
                    },
                    value: 0,
                  },
                  enable: false,
                  options: {},
                },
                outModes: {
                  default: "out",
                  bottom: "out",
                  left: "out",
                  right: "out",
                  top: "out",
                },
                random: false,
                size: false,
                speed: 2,
                spin: {
                  acceleration: 0,
                  enable: false,
                },
                straight: false,
                trail: {
                  enable: false,
                  length: 10,
                  fillColor: {
                    value: "#000000",
                  },
                },
                vibrate: false,
                warp: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                  factor: 1000,
                },
                limit: 500,
                value: 300,
              },
              opacity: {
                random: {
                  enable: false,
                  minimumValue: 0.1,
                },
                value: 0.5,
                animation: {
                  count: 0,
                  enable: false,
                  speed: 1,
                  sync: false,
                  destroy: "none",
                  startValue: "random",
                  minimumValue: 0.1,
                },
              },
              orbit: {
                animation: {
                  count: 0,
                  enable: false,
                  speed: 1,
                  sync: false,
                },
                enable: false,
                opacity: 1,
                rotation: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 45,
                },
                width: 1,
              },
              reduceDuplicates: false,
              repulse: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
                enabled: false,
                distance: 1,
                duration: 1,
                factor: 1,
                speed: 1,
              },
              roll: {
                darken: {
                  enable: false,
                  value: 0,
                },
                enable: false,
                enlighten: {
                  enable: false,
                  value: 0,
                },
                mode: "vertical",
                speed: 25,
              },
              rotate: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
                animation: {
                  enable: false,
                  speed: 0,
                  sync: false,
                },
                direction: "clockwise",
                path: false,
              },
              shadow: {
                blur: 0,
                color: {
                  value: "#000000",
                },
                enable: false,
                offset: {
                  x: 0,
                  y: 0,
                },
              },
              shape: {
                options: {},
                type: "circle",
              },
              size: {
                random: {
                  enable: true,
                  minimumValue: 1,
                },
                value: {
                  min: 1,
                  max: 5,
                },
                animation: {
                  count: 0,
                  enable: false,
                  speed: 40,
                  sync: false,
                  destroy: "none",
                  startValue: "random",
                  minimumValue: 0.1,
                },
              },
              stroke: {
                width: 0,
              },
              tilt: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
                animation: {
                  enable: false,
                  speed: 0,
                  sync: false,
                },
                direction: "clockwise",
                enable: false,
              },
              twinkle: {
                lines: {
                  enable: false,
                  frequency: 0.05,
                  opacity: 1,
                },
                particles: {
                  enable: false,
                  frequency: 0.05,
                  opacity: 1,
                },
              },
              wobble: {
                distance: 5,
                enable: false,
                speed: 50,
              },
              zIndex: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
                opacityRate: 1,
                sizeRate: 1,
                velocityRate: 1,
              },
            },
            pauseOnBlur: true,
            pauseOnOutsideViewport: true,
            responsive: [],
            themes: [],
            zLayers: 100,
          }}
        />
      </div>
      {div}
    </>
  );
};
