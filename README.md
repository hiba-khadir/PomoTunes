# 🍅PomoTunes 

A **Pomodoro Timer** with integrated task management, customizable music playlists, and visual themes to boost productivity. Combines focus intervals with personalized audio and backgrounds.
built with html ,css and javaScript .

## Features

### Pomodoro Timer
- Customizable work/break intervals (ex : 25/5, 50/10)
- Progress tracking for each session
  
 ![image](https://github.com/hiba-khadir/Pomodoro-website/blob/main/Demo-screenShots/landing-page.png)

### Task Manager
- Add/delete/modify/check tasks , with expected Pomodoro cycles
- Track completed cycles per task
- select current task
  
 ![image](https://github.com/hiba-khadir/Pomodoro-website/blob/main/Demo-screenShots/taskManger.png)

### Music Player
- Search and stream music , with various titles from audius public api
- Create playlists for focus sessions
- Volume control and playback options
  
  ![image](https://github.com/user-attachments/assets/902a2685-9d67-4780-908a-b6e6981ebcb9)
  
### Background Customization
- Choose from built-in themes
- Upload your own background images
  
 ![image](https://github.com/hiba-khadir/Pomodoro-website/blob/main/Demo-screenShots/background-picker.png)

### Settings
- Toggle dark/light mode *(Coming Soon)*
- Custumize timer ( breaks interval ,auto start breaks/pomos..)
  
  ![image](https://github.com/user-attachments/assets/937774f3-5d22-41e7-becd-f17d66d793d9)


---

## 📂 Repository Structure

```
pomodoro/
├── backgrounds/                # Preloaded & user-uploaded background images
├── icons/                      # SVG/icons for UI buttons
│   ├── play.svg
│   ├── settings.svg           # (20+ icons)
│   └── ...
├── scripts/                    # Core functionality
│   ├── pomodoro.js            # Timer logic
│   ├── music.js               # Audio player
│   ├── taskManager.js         # Task handling
│   ├── ui.js
│   └── settings.js
├── styles/                     # CSS files
│   ├── main.css               # Base styles
│   ├── music-styles.css
│   └── ...
└── pomodoro.html              # Main entry point
```

---

## Installation

**Option 1:**
- Download the ZIP from GitHub 
- Extract
- Open `pomodoro.html` in any browser.

**Option 2:**
```bash
git clone https://github.com/hiba-khadir/PomoTunes.git
cd PomoTunes
# open the HTML file in a browser
```

---

## Usage

- **Set Timer:** Adjust work/break durations in Settings.
- **Add Tasks:** Type tasks + expected Pomodoro cycles.
- **Play Music:** Search songs and create playlists.
- **Customize:** Pick a background from the gallery or upload your own.

## Future improvements

- Dark Mode (In Progress)
- Backend integration to save:
  - Favorite tracks
  - Session progress across devices
  - Uploaded backgrounds
    
## License

MIT License - Free to use and modify. Attribution appreciated!

## Project Status

Active Development - Contributions welcome!
