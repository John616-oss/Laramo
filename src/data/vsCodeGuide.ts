export interface ShortcutItem {
  keyWin: string;
  keyMac: string;
  action: string;
  category: 'Navigation' | 'Editing' | 'Terminal' | 'Debugging';
  description: string;
}

export interface ExtensionGuide {
  id: string;
  name: string;
  publisher: string;
  description: string;
  whyStudentNeedsIt: string;
  installCommand: string;
  iconBg: string;
}

export interface GitStepGuide {
  step: number;
  title: string;
  command: string;
  explanationTagalog: string;
  explanationEnglish: string;
  commonMistake: string;
  proTip: string;
}

export const VS_CODE_SHORTCUTS: ShortcutItem[] = [
  {
    keyWin: 'Ctrl + P',
    keyMac: 'Cmd + P',
    action: 'Quick Open File',
    category: 'Navigation',
    description: 'Jump immediately to any file in your project by typing its name without opening folders.'
  },
  {
    keyWin: 'Ctrl + Shift + P',
    keyMac: 'Cmd + Shift + P',
    action: 'Command Palette',
    category: 'Navigation',
    description: 'Access every single command, setting, and extension action inside VS Code.'
  },
  {
    keyWin: 'Ctrl + `',
    keyMac: 'Cmd + `',
    action: 'Toggle Integrated Terminal',
    category: 'Terminal',
    description: 'Open and hide the built-in command line without leaving your code editor.'
  },
  {
    keyWin: 'Alt + ↑ / ↓',
    keyMac: 'Option + ↑ / ↓',
    action: 'Move Line Up/Down',
    category: 'Editing',
    description: 'Quickly reorder lines or code blocks without cut and paste.'
  },
  {
    keyWin: 'Shift + Alt + ↓',
    keyMac: 'Shift + Option + ↓',
    action: 'Duplicate Line Down',
    category: 'Editing',
    description: 'Clone the current line or selection downwards instantly.'
  },
  {
    keyWin: 'Ctrl + D',
    keyMac: 'Cmd + D',
    action: 'Add Selection to Next Find Match',
    category: 'Editing',
    description: 'Multi-cursor editing! Selects the next identical word so you can rename variables in seconds.'
  },
  {
    keyWin: 'Ctrl + /',
    keyMac: 'Cmd + /',
    action: 'Toggle Line Comment',
    category: 'Editing',
    description: 'Comment out or uncomment code in any programming language automatically.'
  },
  {
    keyWin: 'F5',
    keyMac: 'F5',
    action: 'Start Debugging',
    category: 'Debugging',
    description: 'Launch your program with breakpoints to inspect variables and step through execution.'
  }
];

export const RECOMMENDED_EXTENSIONS: ExtensionGuide[] = [
  {
    id: 'python',
    name: 'Python (by Microsoft)',
    publisher: 'Microsoft',
    description: 'IntelliSense, linting, debugging, code formatting, Jupyter notebooks, and virtual environment switching.',
    whyStudentNeedsIt: 'Essential for CS/IT Machine Learning, Data Structures, and Python scripting subjects.',
    installCommand: 'code --install-extension ms-python.python',
    iconBg: 'bg-blue-900/40 text-blue-400'
  },
  {
    id: 'cpp',
    name: 'C/C++ Extension Pack',
    publisher: 'Microsoft',
    description: 'Adds language support for C/C++, including IntelliSense, debugging with GDB/LLDB, and code navigation.',
    whyStudentNeedsIt: 'Must-have for 1st & 2nd Year Computer Science fundamentals, OOP in C++, and competitive programming.',
    installCommand: 'code --install-extension ms-vscode.cpptools-extension-pack',
    iconBg: 'bg-indigo-900/40 text-indigo-400'
  },
  {
    id: 'prettier',
    name: 'Prettier - Code Formatter',
    publisher: 'Prettier',
    description: 'Enforces a consistent code style across JavaScript, TypeScript, HTML, CSS, JSON, and Markdown.',
    whyStudentNeedsIt: 'Automatically fixes messy indentation and bracket spacing on every save (Ctrl+S).',
    installCommand: 'code --install-extension esbenp.prettier-vscode',
    iconBg: 'bg-rose-900/40 text-rose-400'
  },
  {
    id: 'gitlens',
    name: 'GitLens - Git Supercharged',
    publisher: 'GitKraken',
    description: 'Supercharges Git inside VS Code. Shows who wrote each line of code (git blame) and visual commit heatmaps.',
    whyStudentNeedsIt: 'Invaluable for IT student group projects and Capstone thesis version control.',
    installCommand: 'code --install-extension eamodio.gitlens',
    iconBg: 'bg-amber-900/40 text-amber-400'
  },
  {
    id: 'liveserver',
    name: 'Live Server (HTML/CSS/JS)',
    publisher: 'Ritwick Dey',
    description: 'Launch a local development server with live reload feature for static and dynamic HTML/CSS/JavaScript pages.',
    whyStudentNeedsIt: 'Crucial for Web Development subjects so students can see changes instantly without manually refreshing browser.',
    installCommand: 'code --install-extension ritwickdey.LiveServer',
    iconBg: 'bg-emerald-900/40 text-emerald-400'
  },
  {
    id: 'php-intelephense',
    name: 'PHP Intelephense',
    publisher: 'Ben Mewburn',
    description: 'Essential intelligence for PHP development: detailed code completion, parameter hints, syntax diagnosis, and go-to-definition.',
    whyStudentNeedsIt: 'Kailangan para sa 2nd/3rd Year Web Development at Backend PHP/MySQL subjects upang maiwasan ang mga syntax error.',
    installCommand: 'code --install-extension bmewburn.vscode-intelephense-client',
    iconBg: 'bg-purple-900/40 text-purple-400'
  },
  {
    id: 'auto-rename-tag',
    name: 'Auto Rename Tag (HTML & XML)',
    publisher: 'Jun Han',
    description: 'Automatically renames paired HTML/XML tags when modifying the opening or closing tag.',
    whyStudentNeedsIt: 'Sobrang bilis mag-edit ng HTML5 tags tulad ng <article>, <header>, at <div> nang hindi nagkakamali sa closing tag.',
    installCommand: 'code --install-extension formulahendry.auto-rename-tag',
    iconBg: 'bg-amber-900/40 text-amber-400'
  }
];

export const GITHUB_WORKFLOW_STEPS: GitStepGuide[] = [
  {
    step: 1,
    title: 'Initialize Local Git Repository',
    command: 'git init',
    explanationTagalog: 'Sinisimulan nito ang Git tracking sa loob ng iyong project folder. Lumilikha ito ng hidden `.git` folder.',
    explanationEnglish: 'Initializes a new Git repository in your project root, creating the hidden .git metadata folder.',
    commonMistake: 'Huwag i-run ang git init sa iyong Desktop o Users folder! Siguraduhing nasa loob ka ng specific project folder.',
    proTip: 'Tingnan kung initialized na gamit ang command na: git status'
  },
  {
    step: 2,
    title: 'Stage Your Files for Commit',
    command: 'git add .',
    explanationTagalog: 'Inihahanda (staging area) ang lahat ng binago o bagong files para maisama sa susunod na save snapshot.',
    explanationEnglish: 'Stages all new and modified files in the working directory into the index for the next commit.',
    commonMistake: 'Nakalimutang gumawa ng `.gitignore` file bago mag-add, kaya nasasama ang mabibigat na `node_modules` o build files.',
    proTip: 'Kung isang file lang ang gusto mong i-stage: git add main.py'
  },
  {
    step: 3,
    title: 'Commit with a Clear Message',
    command: 'git commit -m "feat: initial project structure"',
    explanationTagalog: 'Ito ang snapshot o permanenteng checkpoint ng iyong code kasama ang maikling paliwanag kung ano ang ginawa mo.',
    explanationEnglish: 'Creates a permanent snapshot in your local repository log with an explanatory commit message.',
    commonMistake: 'Paggamit ng walang kwentang message tulad ng "asdf" o "update". Gamitin ang Conventional Commits (feat, fix, docs).',
    proTip: 'Maaaring tingnan ang commit history gamit ang: git log --oneline'
  },
  {
    step: 4,
    title: 'Create Repository on GitHub',
    command: 'https://github.com/new',
    explanationTagalog: 'Pumunta sa GitHub -> click ang "+" icon sa kanang itaas -> "New repository". Ilagay ang Repository Name at iwanang unchecked ang "Add README" kung may local code ka na.',
    explanationEnglish: 'Navigate to GitHub, create a new repository with a descriptive name, and leave README uninitialized if you have existing local code.',
    commonMistake: 'Kapag pinili mong i-check ang "Add README" sa GitHub habang may existing files ka na sa local, magkakaroon ng merge conflict sa first push.',
    proTip: 'Piliin ang Public kung school project o portfolio, o Private kung may sensitive assignments.'
  },
  {
    step: 5,
    title: 'Set Default Branch to Main',
    command: 'git branch -M main',
    explanationTagalog: 'Pinapalitan ang pangalan ng default branch mula sa lumang "master" patungo sa modernong standard na "main".',
    explanationEnglish: 'Renames the active default branch to "main" matching current GitHub industry standards.',
    commonMistake: 'Minsan nakalimutan ito kaya napupunta sa master branch ang code sa halip na main.',
    proTip: 'I-check ang kasalukuyang branch gamit ang: git branch'
  },
  {
    step: 6,
    title: 'Link Your Local Repo to GitHub Remote',
    command: 'git remote add origin https://github.com/<username>/<repo-name>.git',
    explanationTagalog: 'Ikinokonekta ang iyong local computer folder sa cloud repository sa GitHub. Ang "origin" ang tawag sa server alias.',
    explanationEnglish: 'Adds a remote reference named "origin" pointing to your GitHub cloud repository URL.',
    commonMistake: 'Maling spelling ng username o repo URL. Pwedeng i-verify gamit ang: git remote -v',
    proTip: 'Kung nagkamali ka sa URL, palitan gamit ang: git remote set-url origin <new-url>'
  },
  {
    step: 7,
    title: 'Push Your Code to GitHub (First Push)',
    command: 'git push -u origin main',
    explanationTagalog: 'Ipinapadala (upload) ang iyong mga commit patungo sa GitHub main branch. Ang "-u" flag ay nagtatakda ng upstream tracking.',
    explanationEnglish: 'Uploads your local commits to GitHub and sets up upstream tracking so future pushes only require "git push".',
    commonMistake: 'Authentication error: Siguraduhing naka-login sa GitHub CLI o may Personal Access Token (PAT) kung hiningan ng password.',
    proTip: 'Sa mga susunod na araw, ang kailangan mo na lang i-type ay tatlong utos: git add . -> git commit -m "mensahe" -> git push'
  }
];
