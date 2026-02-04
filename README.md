# Virtual Osmosis Lab - Grade 8 Biology

An interactive virtual laboratory for learning about osmosis in living cells.

## 🎯 Learning Outcome
Demonstrate osmosis in living things through interactive simulations and experiments.

## ✨ Features

- **Interactive Theory Section**: Learn about osmosis, semi-permeable membranes, and solution types
- **Animated Water Movement**: Visual demonstration of water molecules moving through membranes
- **Potato Experiment Simulation**: Hands-on virtual experiment with adjustable parameters
- **Real-World Applications**: Discover how osmosis affects everyday life
- **Assessment Quiz**: Test your understanding with drag-and-drop and multiple-choice questions
- **Progress Tracking**: Monitor your learning journey through the lab

## 📚 Topics Covered

1. **Introduction to Osmosis**
   - Definition and importance
   - Key terminology
   
2. **Osmosis Theory**
   - Water movement across membranes
   - Hypotonic, hypertonic, and isotonic solutions
   - Cell responses to different solutions

3. **Potato Experiment**
   - Step-by-step virtual experiment
   - Interactive controls (timer, concentration slider)
   - Real-time visualization
   - Observation recording

4. **Real-World Applications**
   - Food preservation
   - Medical applications
   - Plant biology
   - Marine life adaptations

5. **Assessment**
   - Interactive drag-and-drop matching
   - Multiple-choice questions
   - Instant feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Extract the lab files to a directory
2. Open a terminal in that directory
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown (usually `http://localhost:5173`)

### Build for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
virtual-osmosis-lab/
├── src/
│   ├── components/
│   │   ├── Introduction.jsx
│   │   ├── OsmosisTheory.jsx
│   │   ├── PotatoExperiment.jsx
│   │   ├── RealWorldApplications.jsx
│   │   ├── AssessmentQuiz.jsx
│   │   ├── NavigationButtons.jsx
│   │   ├── visualizations/
│   │   │   └── WaterMovementAnimation.jsx
│   │   └── styles/
│   │       └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Features in Detail

### Potato Experiment Simulator
- Place potato tissue in petri dish
- Add distilled water
- Add salt solution to the scoop
- Set experiment timer (up to 30 minutes)
- Adjust salt concentration (0-100%)
- Watch solution level rise in real-time
- Record observations and explanations

### Interactive Elements
- Drag-and-drop assessment activities
- Live water molecule animations
- Adjustable concentration sliders
- Visual feedback for correct/incorrect answers
- Progress tracking across all sections

### Educational Design
- Multi-modal learning (visual, interactive, textual)
- Step-by-step guided experiments
- Immediate feedback
- Real-world connections
- Self-paced learning

## 🧪 Experiment Controls

- **Timer**: Counts up to 30 minutes (accelerated for demo)
- **Salt Concentration Slider**: Adjust from 0% (dilute) to 100% (concentrated)
- **Solution Level**: Rises based on osmosis rate
- **Reset Button**: Start experiment over
- **Observation Recording**: Document what you see and explain why

## 📊 Assessment

The assessment includes:
- **Drag & Drop**: Match solution types to cell effects (3 questions)
- **Multiple Choice**: Answer questions about osmosis concepts (4 questions)
- **Passing Score**: 70% or higher (5+ out of 7 correct)
- **Instant Feedback**: See correct answers and explanations

## 🌐 Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)

## 📱 Responsive Design

The lab adapts to different screen sizes:
- Desktop (1400px+): Full layout
- Tablet (768px-1400px): Adapted grid
- Mobile (<768px): Stacked layout

## 🎓 For Teachers

This virtual lab can be used for:
- Remote learning
- In-class demonstrations
- Homework assignments
- Formative assessment
- Self-paced learning

Students can complete the lab independently and teachers can review their observations and quiz results.

## 🔧 Customization

To customize the lab:
1. Edit component files in `src/components/`
2. Modify styling in `src/components/styles/animations.css`
3. Adjust experiment parameters in `PotatoExperiment.jsx`
4. Add new sections by creating new components and updating `App.jsx`

## 📝 License

This educational resource is designed for Grade 8 Integrated Science - Biology curriculum.

## 🤝 Support

For questions or issues, please refer to your course materials or contact your instructor.

---

**Grade Level**: 8
**Subject**: Integrated Science - Biology
**Strand**: Living things and their environment
**Substrand**: Movement of materials in and out of the cell# cem-labs-osmosis
