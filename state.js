export const sharedState = {
    running: false,
    all_loaded: false,
    general_dragged: false,
    general_hovered: false,
    grid_size:64,
    rotation_pos: 0,
    lines_disappear_animation_done: false,
    starting_animation_done: false,
    animation_color: 150,
    colors: {
        "C++": "Aquamarine",
        "Docker": "DodgerBlue",
        "CSS": "aqua",
        "Java": "red",
        "SpringBoot": "rgb(188, 34, 0)",
        "HTML": "coral",
        "MongoDB": "Chartreuse",
        "AWS": "DimGrey",
        "Web Development": "grey",
        "Javascript": "DarkGreen",
        "TypeScript": "rgb(72, 132, 200)",
        "GIT": "Olive",
        "SQL": "DarkMagenta",
        "Shell": "black",
        "Python": "blue",
        "Machine Learning": "yellow",
        "Visual Basic for Application": "green",
        "Apache Kafka": "rgb(200, 200, 200)"
      }
};
export const canvasSize = 1000;
export const balls = [];
export const map = new Map();
export const matrix = [];
export const location = Array(sharedState.grid_size).fill().map(() => Array(sharedState.grid_size).fill().map(() => []));