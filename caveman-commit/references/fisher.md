# fish-git-emojis

Shortcuts to commit with Gitmoji messages. Default emojis are inspired from [gitmoji](https://gitmoji.carloscuesta.me/), and messages follow [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and [Angular commit messages guidelines]([https://link](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)).

## 🚀 Install

Using [fisher](https://github.com/jorgebucaran/fisher) :

```console
fisher install Gazorby/fish-git-emojis
```

## 🔧 Usage

`command [<scope>] <commit message> [options]`

options :

```console
-k --breaking           Add a "!" after the type/scope to indicate a breaking change
-f --footer STRING      Add a footer. Can be used multiple times for multiple footers
-b --b-footer STRING    Add a breaking change footer. The message will be prepended by "BREAKING CHANGE:". Can be used multiple time for multiple footers
```

| Command | Emoji |
|-------- | ----------- |
| gbuild  | 👷 build/chore |
| gci     | 💚 Continuous integration |
| gdocs    | 📝 Documentation |
| gfix    | 🐛 Bugfix |
| gfeat   | ✨ New feature |
| gperf   | ⚡️ Improve performance |
| gref    | ♻️ Code refactoring |
| gstyle  | 🎨 Code style |
| gtest   | ✅ Test |

### Examples

- `gfeat "my new feat"` => `✨ feat: my new feat"`

- `gdocs "readme" "add badges"` => `📝 doc(readme): "add badge"`

- `gref "parser" "remove json parser" -k -b "Drop support for json parsing"` :

    ```console
    ♻️ refactor(parser)!: remove json parser

    BREAKING CHANGE : Drop support for json parsing
    ```
- `gperf "parser" "improve toml parsing" -f "toml parsing is 2x faster"` :

  ```console
  ⚡️ perf(parser) improve toml parsing

  toml parsing is 2x faster
  ```

- `gref "drop support for Node 6" -k` => `♻️ refactor!: drop support for Node 6`