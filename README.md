# CSE5543 Lab 1
CSE 5543 Geometric Modeling at Ohio State

https://github.com/MH15/CSE5543


## Notes

I developed this project in [Typescript](https://www.typescriptlang.org/) using the [Vite](https://vitejs.dev/) framework. I've taken the best effort to ensure the compiled Javascript code matches as closely as possible. To view the compiled version (pure HTML and Javascript), open a terminal in the `submit` directory and run one of the following commands:

```bash
# if you have NodeJS installed,
npx serve

# if you have Python installed,
python server.py
```

## Running Dev Server

While the compiled source is complete and non-minified, I couldn't figure out how to get it to retain comments. If you'd like to see my comments, you can look at the Typescript source code. 

If you'd like to run the Typescript source code of the project, do the following commands in the `labs` directory.

```bash
npm install
npm run dev
```

**Both versions should function identically in most browsers.**

Contact me at `hall.2586@osu.edu` if you have any issues running this.


## Usage

When the page loads, upload a file or choose the number of points you'd like to draw. Then, the slider on the right controls display resolution and the checkbox hides/shows the lines connecting each control point. Subdivide button in the bottom corner subdivides and the save button, well, it saves.