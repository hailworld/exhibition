import React, { useEffect, useReducer, useRef, useState } from 'react';
import * as three from 'three';
import TWEEN from '@tweenjs/tween.js';
import { getRotation } from '../../utils';

const { PI } = Math;
// 是否为移动端
const IS_MOBILE = window.navigator.userAgent.toLowerCase().indexOf('mobile') > -1;

// 已按下的键
const keySet = new Set();
const init = container => {
  const { offsetWidth, offsetHeight } = container;
  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(75, offsetWidth / offsetHeight, 0.1, 1000);
  camera.position.set(0, 0, 12);
  camera.rotation.set(PI / 2, 0, 0)
  const renderer = new three.WebGLRenderer({ antialias: true });
  renderer.setSize(offsetWidth, offsetHeight);
  renderer.setClearColor(0x222842, 1);
  container.appendChild(renderer.domElement);
  // 添加实例到window对象，方便调试
  window.scene = scene;
  window.camera = camera;
  window.renderer = renderer;
  return { scene, camera, renderer };
};
// 添加环境光
const addLights = ({ scene }) => {
  const ambientLight = new three.AmbientLight(0xFFFFFF, 0.5);
  scene.add(ambientLight);
};
// 添加鼠标控制、手势控制、键盘控制
const addControls = ({ camera, renderer }) => {
  const { domElement } = renderer;
  const addTouchControls = () => {
    const onTouchStart = startEvent => {
      const { touches: startTouches } = startEvent;
      if (startTouches.length === 1) {
        const { offsetWidth, offsetHeight } = domElement;
        const { x, y } = camera.rotation;
        const { clientX: startX, clientY: startY } = startTouches[0];
        const onTouchMove = moveEvent => {
          const { touches: moveTouches } = moveEvent;
          if (moveTouches.length !== 1) return;
          const { clientX: moveX, clientY: moveY } = moveTouches[0];
          const dy = moveY - startY;
          const rotationX = x + (dy / (offsetHeight / 2) * PI);
          camera.rotation.x = rotationX;
          camera.rotation.x = x; // 不允许沿x轴转动
          const dx = moveX - startX;
          const rotationY = y + (dx / (offsetWidth / 2) * (2 * PI))
          camera.rotation.y = rotationY;
        }
        const onTouchEnd = () => {
          domElement.removeEventListener('touchmove', onTouchMove);
          domElement.removeEventListener('touchend', onTouchEnd);
        }
        domElement.addEventListener('touchmove', onTouchMove);
        domElement.addEventListener('touchend', onTouchEnd);
      } else if (startTouches.length === 2) {
        const { x, y } = camera.position;
        const startDistance = Math.sqrt(Math.pow((startTouches[0].clientX - startTouches[1].clientX), 2) + Math.pow((startTouches[0].clientY - startTouches[1].clientY), 2));
        const onTouchMove = moveEvent => {
          const { touches: moveTouches } = moveEvent;
          if (moveTouches.length !== 2) return;
          const moveDistance = Math.sqrt(Math.pow((moveTouches[0].clientX - moveTouches[1].clientX), 2) + Math.pow((moveTouches[0].clientY - moveTouches[1].clientY), 2));
          const ratio = moveDistance / startDistance;
          const { y: rotationY } = camera.rotation;
          if (ratio < 1) {
            const dx = Math.sin(rotationY) * 10;
            const dy = -Math.cos(rotationY) * 10;
            camera.position.x = x + (dx * (1 / ratio));
            camera.position.y = y + (dy * (1 / ratio));
          } else {
            const dx = -Math.sin(rotationY) * 10;
            const dy = Math.cos(rotationY) * 10;
            camera.position.x = x + (dx * ratio);
            camera.position.y = y + (dy * ratio);
          }
        };
        const onTouchEnd = () => {
          domElement.removeEventListener('touchmove', onTouchMove);
          domElement.removeEventListener('touchend', onTouchEnd);
        }
        domElement.addEventListener('touchmove', onTouchMove);
        domElement.addEventListener('touchend', onTouchEnd);
      }
    };
    domElement.addEventListener('touchstart', onTouchStart);
  };
  const addMouseControls = () => {

    const onPointerDown = downEvent => {
      const { offsetWidth, offsetHeight } = domElement;
      const { x, y } = camera.rotation;
      const { offsetX: downX, offsetY: downY } = downEvent;
      const onPointerMove = moveEvent => {
        const { offsetX: moveX, offsetY: moveY } = moveEvent;
        const dy = moveY - downY;
        const rotationX = x + (dy / (offsetHeight / 2) * PI);
        camera.rotation.x = rotationX;
        camera.rotation.x = x; // 不允许沿x轴转动
        const dx = moveX - downX;
        const rotationY = y + (dx / (offsetWidth / 2) * (2 * PI))
        camera.rotation.y = rotationY;
      }
      const onPointerUp = () => {
        domElement.removeEventListener('pointermove', onPointerMove);
        domElement.removeEventListener('pointerup', onPointerUp);
      }
      domElement.addEventListener('pointermove', onPointerMove);
      domElement.addEventListener('pointerup', onPointerUp);
    };
    const onWheel = e => {
      const { deltaY } = e;
      const { y: rotationY } = camera.rotation;
      // deltaY > 0 缩小
      if (deltaY > 0) {
        const dx = Math.sin(rotationY);
        const dy = -Math.cos(rotationY);
        camera.position.x += dx;
        camera.position.y += dy;
      } else {
        const dx = -Math.sin(rotationY);
        const dy = Math.cos(rotationY);
        camera.position.x += dx;
        camera.position.y += dy;
      }
    };
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('wheel', onWheel);
  };
  const addKeyboardControls = () => {
    // 字母键对应的方向
    const keyMap = {
      'w': 'ArrowUp',
      'a': 'ArrowLeft',
      's': 'ArrowDown',
      'd': 'ArrowRight',
    };
    const onArrowUp = () => {
      if (keySet.has('ArrowUp')) {
        const { y: rotationY } = camera.rotation;
        const dx = -Math.sin(rotationY);
        const dy = Math.cos(rotationY);
        camera.position.x += dx;
        camera.position.y += dy;
        requestAnimationFrame(onArrowUp);
      }
    };
    const onArrowRight = () => {
      if (keySet.has('ArrowRight')) {
        if (keySet.has('Control')) {
          camera.rotation.y -= (PI / 180);
        } else {
          const { y: rotationY } = camera.rotation;
          const dx = Math.cos(rotationY);
          const dy = Math.sin(rotationY);
          console.log(dx, dy)
          camera.position.x += dx;
          camera.position.y += dy;
        }
        requestAnimationFrame(onArrowRight);
      }
    };
    const onArrowDown = () => {
      if (keySet.has('ArrowDown')) {
        const { y: rotationY } = camera.rotation;
        const dx = Math.sin(rotationY);
        const dy = -Math.cos(rotationY);
        camera.position.x += dx;
        camera.position.y += dy;
        requestAnimationFrame(onArrowDown);
      }
    };
    const onArrowLeft = () => {
      if (keySet.has('ArrowLeft')) {
        if (keySet.has('Control')) {
          camera.rotation.y += (PI / 180);
        } else {
          const { y: rotationY } = camera.rotation;
          const dx = -Math.cos(rotationY);
          const dy = -Math.sin(rotationY);
          console.log(dx, dy)
          camera.position.x += dx;
          camera.position.y += dy;
        }
        requestAnimationFrame(onArrowLeft);
      }
    };
    const onKeyDown = e => {
      let { key } = e;
      key = keyMap[key] || key;
      if (keySet.has(key)) return;
      keySet.add(key);
      switch (key) {
        case 'Control':
          keySet.add('Control');
          break;
        case 'ArrowUp':
          keySet.delete('ArrowDown');
          onArrowUp();
          break;
        case 'ArrowRight':
          keySet.delete('ArrowLeft');
          onArrowRight();
          break;
        case 'ArrowDown':
          keySet.delete('ArrowUp');
          onArrowDown();
          break;
        case 'ArrowLeft':
          keySet.delete('ArrowRight');
          onArrowLeft();
          break;
        default:
          break;
      }
    };
    const onKeyUp = e => {
      let { key } = e;
      key = keyMap[key] || key;
      keySet.delete(key);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  };
  if (IS_MOBILE) {
    addTouchControls();
  } else {
    addMouseControls();
    addKeyboardControls();
  }

};
// 添加光线追踪，处理点击事件
const addRaycaster = ({ scene, camera, renderer }) => {
  const { domElement } = renderer;
  const onPointerDown = downEvent => {
    const { offsetX: downX, offsetY: downY } = downEvent;
    const startTime = Date.now();
    const onPointerUp = upEvent => {
      domElement.removeEventListener('pointerup', onPointerUp);
      const { offsetX: upX, offsetY: upY } = upEvent;
      const endTime = Date.now();
      // 判断是否为拖拽
      if (
        Math.abs(downX - upX) > 5 ||
        Math.abs(downY - upY) > 5 ||
        endTime - startTime > 1000
      ) return;
      const { offsetWidth, offsetHeight } = domElement;
      const raycaster = new three.Raycaster();
      const x = (upX / offsetWidth) * 2 - 1;
      const y = -(upY / offsetHeight) * 2 + 1;
      const mouse = new three.Vector2(x, y);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const [intersect] = intersects;
      if (
        intersect &&
        intersect.object &&
        intersect.object.onClick
      ) {
        intersect.object.onClick(intersect);
      }
    }
    domElement.addEventListener('pointerup', onPointerUp);
  }
  domElement.addEventListener('pointerdown', onPointerDown);
};
// 添加 grid 参考和 axis 参考
const drawReferences = ({ scene }) => {
  const gridWidth = 100;
  const grid = new three.GridHelper(gridWidth, 10);
  grid.rotation.x = PI / 2;
  scene.add(grid);
  const axes = new three.AxesHelper(gridWidth / 2);
  scene.add(axes);
};
// 绘制一楼
const drawFirstFloor = ({ scene, camera }) => {
  const addPointLight = () => {
    const pointLight = new three.PointLight(0xFFFFFF, 1, 80);
    pointLight.position.set(0, 0, 19);
    scene.add(pointLight);
  };
  const drawFloor = () => {
    const geometry = new three.BoxGeometry(100, 100, 1);
    const material = new three.MeshPhysicalMaterial({ color: 0x333333 });
    const floor = new three.Mesh(geometry, material);
    floor.position.z = -0.5;
    floor.onClick = intersect => {
      // 控制范围，不能离墙过近
      let { x, y } = intersect.point;
      if (Math.abs(x) > 30) x = x > 0 ? 30 : - 30;
      if (Math.abs(y) > 30) y = y > 0 ? 30 : -30;
      const distance = Math.sqrt(Math.pow(camera.position.x - x, 2) + Math.pow(camera.position.y - y, 2));
      const duration = distance * 10;
      new TWEEN.Tween(camera.position)
        .to({ x, y }, duration)
        .interpolation(TWEEN.Interpolation.Bezier)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    };
    scene.add(floor);
  };
  const drawCeiling = () => {
    const geometry = new three.BoxGeometry(100, 100, 1);
    const material = new three.MeshPhysicalMaterial({ color: 0xFFFFFF });
    const ceiling = new three.Mesh(geometry, material);
    ceiling.position.z = 20 + 0.5;
    scene.add(ceiling);
  };
  const drawWalls = () => {
    /**
     * 创建展品
     * @param {*} path 展品图片路径
     * @param {*} transform 点击展品时设置机位
     * @returns 
     */
    const createExhibit = (path, transform) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
          const { width, height } = image;
          const ratioX = width / 16;
          const ratioY = height / 9;
          const ratio = Math.max(ratioX, ratioY);
          const w = width / ratio;
          const h = height / ratio;
          const texture = new three.TextureLoader().load(path);
          const geometry = new three.BoxGeometry(w, h, 0.2);
          const material = [
            new three.MeshPhysicalMaterial({ color: 0xFFFFFF }),
            new three.MeshPhysicalMaterial({ color: 0xFFFFFF }),
            new three.MeshPhysicalMaterial({ color: 0xFFFFFF }),
            new three.MeshPhysicalMaterial({ color: 0xFFFFFF }),
            new three.MeshPhysicalMaterial({ color: 0xFFFFFF }),
            new three.MeshPhysicalMaterial({ map: texture }),
          ];
          const exhibit = new three.Mesh(geometry, material);
          exhibit.position.y = 0.2;
          exhibit.rotation.x = PI / 2;
          exhibit.onClick = () => {
            var box = new three.Box3();
            box.setFromObject(exhibit);
            const { min, max } = box;
            const boxCenter = {
              x: min.x + ((max.x - min.x) / 2),
              y: min.y + ((max.y - min.y) / 2),
              z: min.z + ((max.z - min.z) / 2),
            };
            const newPosition = { x: boxCenter.x + transform.position.x, y: boxCenter.y + transform.position.y };
            const newRotation = { y: getRotation(camera.rotation.y, transform.rotation.y) };
            const distance = Math.sqrt(Math.pow(camera.position.x - newPosition.x, 2) + Math.pow(camera.position.y - newPosition.y, 2));
            const duration = distance * 10;
            new TWEEN.Tween(camera)
              .to({ position: newPosition, rotation: newRotation }, duration)
              .interpolation(TWEEN.Interpolation.Bezier)
              .easing(TWEEN.Easing.Linear.None)
              .start();
          }
          const group = new three.Group();
          group.add(exhibit);
          resolve(group);
        };
        image.onerror = () => reject();
      })
    };
    /**
     * 创建墙壁
     * @param {*} paths 展品图片路径列表
     * @param {*} transform 点击展品时设置机位
     * @returns 
     */
    const createWall = (paths, transform) => {
      const geometry = new three.BoxGeometry(100, 20, 1);
      const material = new three.MeshPhysicalMaterial({ color: 0xDDDDDD });
      const wall = new three.Mesh(geometry, material);
      wall.position.z = 10;
      wall.rotation.x = PI / 2;
      // create group
      const group = new three.Group();
      group.add(wall);
      // add exhibits
      const spacing = 100 / 5;
      const startX = spacing / 2;
      paths.forEach((path, index) => {
        createExhibit(path, transform).then(exhibit => {
          const x = -50 + startX + (spacing * index);
          exhibit.position.set(x, 0.5, 12);
          group.add(exhibit);
        });
      })
      return group;
    };
    // 正面墙
    const wallFront = createWall([
      './exhibits/1-1.jpg',
      './exhibits/1-2.jpg',
      './exhibits/1-3.jpg',
      './exhibits/1-4.jpg',
      './exhibits/1-5.jpg',
    ], {
      position: { x: 0, y: -20 },
      rotation: { y: 0 },
    });
    wallFront.position.set(0, 50, 0);
    wallFront.rotation.set(0, 0, PI);
    // 背面墙
    const wallBack = createWall([
      './exhibits/2-1.jpg',
      './exhibits/2-2.jpg',
      './exhibits/2-3.jpg',
      './exhibits/2-4.jpg',
      './exhibits/2-5.jpg',
    ], {
      position: { x: 0, y: 20 },
      rotation: { y: PI },
    });
    wallBack.position.set(0, -50, 0);
    // 左面墙
    const wallLeft = createWall([
      './exhibits/3-1.jpg',
      './exhibits/3-2.jpg',
      './exhibits/3-3.jpg',
      './exhibits/3-4.jpg',
      './exhibits/3-5.jpg',
    ], {
      position: { x: 20, y: 0 },
      rotation: { y: PI / 2 },
    });
    wallLeft.position.set(-50, 0, 0);
    wallLeft.rotation.set(0, 0, PI / 2 * 3);
    // 右面墙
    const wallRight = createWall([
      './exhibits/4-1.jpg',
      './exhibits/4-2.jpg',
      './exhibits/4-3.jpg',
      './exhibits/4-4.jpg',
      './exhibits/4-5.jpg',
    ], {
      position: { x: -20, y: 0 },
      rotation: { y: PI / 2 * 3 },
    });
    wallRight.position.set(50, 0, 0);
    wallRight.rotation.set(0, 0, PI / 2);
    scene.add(wallFront, wallBack, wallLeft, wallRight);
  };
  addPointLight();
  drawFloor();
  drawCeiling();
  drawWalls();
};


const Exhibition = () => {
  const containerRef = useRef();
  const [inited, setInited] = useState(false);
  const [{ scene, camera, renderer }, setInstances] = useReducer((state, newState) => ({ ...state, ...newState }), {});
  /**
   * 初始化
   */
  useEffect(() => {
    if (inited) return;
    const container = containerRef.current;
    const instances = init(container);
    setInited(true);
    setInstances(instances);
    addLights(instances);
    addControls(instances);
    addRaycaster(instances);
    // drawReferences(instances);
    drawFirstFloor(instances);
  }, [inited]);
  /**
   * 监听窗口缩放
   */
  useEffect(() => {
    if (!camera || !renderer) return;
    // resize
    const onResize = () => {
      const container = containerRef.current;
      const { offsetWidth, offsetHeight } = container;
      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(offsetWidth, offsetHeight);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [camera, renderer]);
  /**
   * 渲染场景
   */
  useEffect(() => {
    if (!scene || !camera || !renderer) return;
    let interrupt = false;
    const update = () => {
      if (interrupt) return;
      requestAnimationFrame(update);
      TWEEN.update();
      renderer.render(scene, camera);
    };
    update();
    return () => interrupt = true;
  }, [scene, camera, renderer]);
  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        touchAction: 'none',
      }}
    />
  )
}

export default Exhibition;