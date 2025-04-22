import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Función para crear un visor 3D en un contenedor
function crearVisor3D(containerId, modeloOBJ, modeloMTL, escala) {
  // 1. Obtener el contenedor donde irá el modelo
  const contenedor = document.getElementById(containerId);
  if (!contenedor) return;
  
  // 2. Crear los elementos básicos de Three.js
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x111111); // Fondo negro
  
  // 3. Crear cámara
  const camara = new THREE.PerspectiveCamera(
    45, // Campo de visión
    contenedor.clientWidth / contenedor.clientHeight, // Proporción
    0.1, // Plano cercano
    1000 // Plano lejano
  );
  camara.position.z = 3; // Alejar la cámara
  
  // 4. Crear renderizador
  const renderizador = new THREE.WebGLRenderer({ antialias: true });
  renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
  contenedor.appendChild(renderizador.domElement);
  
  // 5. Añadir luces
  const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
  escena.add(luzAmbiente);
  
  const luzDireccional = new THREE.DirectionalLight(0xffffff, 0.6);
  luzDireccional.position.set(5, 5, 5);
  escena.add(luzDireccional);
  
  // 6. Cargar el modelo
  const cargadorMTL = new MTLLoader();
  cargadorMTL.setPath('/modelos/');
  cargadorMTL.load(modeloMTL, (materiales) => {
    materiales.preload();
    
    const cargadorOBJ = new OBJLoader();
    cargadorOBJ.setMaterials(materiales);
    cargadorOBJ.setPath('/modelos/');
    cargadorOBJ.load(modeloOBJ, (objeto) => {
      // Ajustar escala
      objeto.scale.set(escala, escala, escala);
      
      // Posicionar el objeto
      objeto.position.y = -0.5;
      
      // Añadir a la escena
      escena.add(objeto);
      
      // 7. Animar
      function animar() {
        requestAnimationFrame(animar);
        
        // Rotar el objeto
        objeto.rotation.y += 0.01;
        
        // Renderizar
        renderizador.render(escena, camara);
      }
      
      animar();
    });
  });
}

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear visor en el contenedor principal
  crearVisor3D('canvas-container', 'carrito.obj', 'carrito.mtl', 0.1);
  
  // Crear visores en las cards
  crearVisor3D('sedan-3d-container', 'carrito2.obj', 'carrito.mtl', 0.08);
  crearVisor3D('pickup-3d-container', 'carro3.obj', 'carro3.mtl', 0.08);
});
