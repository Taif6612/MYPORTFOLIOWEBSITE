---
title: "A Student's Guide to Git and GitHub"
description: "Stop fearing version control. A beginner-friendly guide to the Git workflow every developer is expected to know — commits, branches, pull requests, and fixing common mistakes."
date: 2026-06-04
tags: ["Git", "Tools", "Career"]
author: "Taif Ur Rahman"
featured: false
draft: false
---

Git is the single most expected skill that universities under-teach. Employers
assume you know it; most students learn it the night before a group project goes
wrong. Let's fix that.

## The mental model

Git tracks **snapshots** of your project over time. Three places matter:

- **Working directory** — your files as they are right now.
- **Staging area** — changes you've marked to include in the next snapshot.
- **Repository** — the saved history of snapshots (commits).

## The everyday workflow

Ninety percent of your Git usage is four commands:

```bash
git status              # what changed?
git add .               # stage the changes
git commit -m "message" # snapshot them with a clear message
git push                # send commits to GitHub
```

### Write commit messages for your future self

A good message explains *why*, not *what*. Compare:

```text
bad:  "fixed stuff"
good: "Fix login redirect failing when email has a trailing space"
```

## Branches: work without breaking main

A branch is a parallel line of work. Use one per feature so `main` always works.

```bash
git checkout -b feature/search   # create + switch to a branch
# ...make changes, commit...
git push -u origin feature/search
```

Then open a **pull request** on GitHub to merge it back. Pull requests are where
code review happens — and reviewing PRs is a huge part of a real engineering job.

## Fixing common mistakes

Everyone hits these. None of them are fatal.

| Problem | Fix |
| --- | --- |
| Committed to the wrong branch | `git reset --soft HEAD~1`, switch branch, recommit |
| Need to undo the last commit (keep changes) | `git reset --soft HEAD~1` |
| Want to discard local changes to a file | `git checkout -- path/to/file` |
| Forgot to pull and now there's a conflict | `git pull`, resolve markers, commit |

> The single best habit: commit small and commit often. Small commits are easy
> to understand, easy to review, and easy to undo.

## Where to go next

Once the basics feel natural, learn `git stash`, interactive rebase, and how to
read a `git log --graph`. But don't rush — fluency with the four everyday
commands already puts you ahead of most students applying for the same roles.
