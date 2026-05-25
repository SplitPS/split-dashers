export default class ModalManager {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Spawns a custom popup alert
   * @param {Object} config - Title, body text, and callbacks for buttons
   */
  createAlert({ title, message, onConfirm, onCancel }) {
    const { width, height } = this.scene.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Main container holding the entire modal system
    const modalContainer = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    // 2. Dimmed background block (prevents clicks behind it)
    const overlay = this.scene.add.rectangle(centerX, centerY, width, height, 0x000000, 0.4);
    overlay.setInteractive();
    modalContainer.add(overlay);

    // 3. The popup box wrapper (this gets the nice bounce-in animation)
    const dialogBox = this.scene.add.container(centerX, centerY).setScale(0);
    modalContainer.add(dialogBox);

    // 4. Background plate for the popup panel
    const panelBg = this.scene.add.rectangle(0, 0, 460, 240, 0x222222).setStrokeStyle(3, 0xffffff);
    dialogBox.add(panelBg);

    // 5. Title & Message text
    const titleText = this.scene.add.text(0, -80, title, { fontSize: '32px', color: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5);
    const bodyText = this.scene.add.text(0, -10, message, { fontSize: '20px', color: '#ffffff', align: 'center' }).setOrigin(0.5);
    dialogBox.add([titleText, bodyText]);

    // Function to close the modal with a clean fade/shrink
    const closeModal = () => {
      this.scene.tweens.add({
        targets: dialogBox,
        scale: 0,
        alpha: 0,
        duration: 200,
        onComplete: () => modalContainer.destroy()
      });
    };

    // Helper to create functional buttons rapidly
    const createButton = (x, text, color, callback) => {
      const btnBg = this.scene.add.rectangle(x, 65, 140, 45, color).setInteractive({ useHandCursor: true });
      const btnTxt = this.scene.add.text(x, 65, text, { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

      // Simple hover & click states
      btnBg.on('pointerover', () => btnBg.setAlpha(0.8));
      btnBg.on('pointerout', () => btnBg.setAlpha(1));
      btnBg.on('pointerdown', () => {
        closeModal();
        if (callback) callback();
      });

      dialogBox.add([btnBg, btnTxt]);
    };

    // 6. Generate the standard two buttons
    createButton(-80, 'Cancel', 0x888888, onCancel);
    createButton(80, 'Open', 0x27ae60, onConfirm);

    // 7. Pop it into view using a snappy, organic animation
    this.scene.tweens.add({
      targets: dialogBox,
      scale: 1,
      duration: 400,
      ease: 'Back.Out'
    });
  }
  /**
   * Spawns a popup window containing a clean text input field
   * @param {Object} config - Title, placeholder, max length, and callback actions
   */
  createInputModal({ title, placeholder = "Type here...", maxLength = 64, onSearch, onCancel }) {
      const { width, height } = this.scene.scale;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Core container layers
      const modalContainer = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(1000);

      const overlay = this.scene.add.rectangle(centerX, centerY, width, height, 0x000000, 0.6);
      overlay.setInteractive();
      modalContainer.add(overlay);

      const dialogBox = this.scene.add.container(centerX, centerY).setScale(0);
      modalContainer.add(dialogBox);

      // 2. Window Framing (Nice Geometry Dash style blue background)
      const panelBg = this.scene.add.rectangle(0, 0, 500, 260, 0x002e75).setStrokeStyle(4, 0x002762);
      const titleText = this.scene.add.text(0, -90, title, { fontSize: '32px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
      dialogBox.add([panelBg, titleText]);

      // 3. Inject a native HTML DOM input element over the game panel
      // This bypasses the need for 50 lines of custom backspace/paste listeners
      const inputElement = this.scene.add.dom(0, -10, 'input').setOrigin(0.5);

      // Quick CSS style application to match the game's UI aesthetic
      const style = inputElement.node.style;
      style.width = '320px';
      style.height = '45px';
      style.fontSize = '22px';
      style.textAlign = 'center';
      style.backgroundColor = '#001f4f';
      style.color = '#ffffff';
      style.border = '3px solid #00245b';
      style.borderRadius = '6px';
      style.outline = 'none';
      style.fontFamily = 'Arial, sans-serif';

      inputElement.node.placeholder = placeholder;
      inputElement.node.maxLength = maxLength;
      dialogBox.add(inputElement);

      // Auto-focus the input box as soon as it appears
      this.scene.time.delayedCall(200, () => inputElement.node.focus());

      // Clean exit function
      const closeModal = () => {
          this.scene.tweens.add({
              targets: dialogBox,
              scale: 0,
              alpha: 0,
              duration: 200,
              onComplete: () => modalContainer.destroy()
          });
      };

      // 4. Clean Reusable Buttons
      const createButton = (x, text, color, callback) => {
          const btnBg = this.scene.add.rectangle(x, 75, 140, 50, color).setInteractive({ useHandCursor: true });
          const btnTxt = this.scene.add.text(x, 75, text, { fontSize: '22px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

          btnBg.on('pointerover', () => btnBg.setAlpha(0.8));
          btnBg.on('pointerout', () => btnBg.setAlpha(1));
          btnBg.on('pointerdown', () => {
              const value = inputElement.node.value.trim();
              closeModal();
              if (callback) callback(value);
          });

              dialogBox.add([btnBg, btnTxt]);
      };

      createButton(-100, 'Cancel', 0x888888, onCancel);
      createButton(100, 'Search', 0x27ae60, onSearch);

      // 5. Handle Enter Key natively on the HTML field
      inputElement.node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              const value = inputElement.node.value.trim();
              closeModal();
              if (onSearch) onSearch(value);
          }
      });

      // 6. Smooth Bounce Introduction
      this.scene.tweens.add({
          targets: dialogBox,
          scale: 1,
          duration: 350,
          ease: 'Back.Out'
      });
  }
}

