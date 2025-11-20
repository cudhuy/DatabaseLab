## Tinkerbell Garden
<p align="left">Project of Team24 for subject 'Software Engineering' of HN university of Science and Technology</p>
</div>

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

---

## Git Conventions

Please go through [it](https://docs.google.com/document/d/1QnqfDwXZ7QyC6HHMwNRyLfyxk5uKHF0CFY1XsPUJBCs/edit?usp=sharing) carefully.

## Usage

### Development

```
  npm install
  npm run dev
```

- Copy `.env.example` to `.env.local` and provide `VITE_BASEURL` so Axios can reach the Express backend.
- The Vite dev server runs on port `3000` to mirror the previous CRA setup; adjust the port in `vite.config.js` if needed.

## VSCode Extensions:

- ESLint
- Prettier
