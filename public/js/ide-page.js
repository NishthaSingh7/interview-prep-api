const IdePage = (() => {
  const STORAGE_PREFIX = "afterhours-ide-code-";
  const STDIN_KEY = "afterhours-ide-stdin";
  const LANG_KEY = "afterhours-ide-language";

  const LANGUAGES = {
    python: {
      label: "Python",
      aceMode: "ace/mode/python",
      template: `# Python 3
def main():
    a, b = map(int, input().split())
    print(a + b)

if __name__ == "__main__":
    main()
`,
    },
    java: {
      label: "Java",
      aceMode: "ace/mode/java",
      template: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
`,
    },
    cpp: {
      label: "C++",
      aceMode: "ace/mode/c_cpp",
      template: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
`,
    },
    c: {
      label: "C",
      aceMode: "ace/mode/c_cpp",
      template: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}
`,
    },
  };

  let editor = null;
  let running = false;
  let themeObserver = null;

  function $(id) {
    return document.getElementById(id);
  }

  function currentLanguage() {
    return $("ideLanguage")?.value || "python";
  }

  function storageKey(lang) {
    return `${STORAGE_PREFIX}${lang}`;
  }

  function loadSavedCode(lang) {
    const saved = localStorage.getItem(storageKey(lang));
    if (saved) return saved;
    return LANGUAGES[lang]?.template || "";
  }

  function saveCode(lang, code) {
    localStorage.setItem(storageKey(lang), code);
  }

  function applyEditorTheme() {
    if (!editor) return;
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "ace/theme/tomorrow_night"
        : "ace/theme/github";
    editor.setTheme(theme);
  }

  function setEditorLanguage(lang) {
    if (!editor) return;
    const config = LANGUAGES[lang];
    if (!config) return;
    editor.session.setMode(config.aceMode);
    editor.setValue(loadSavedCode(lang), -1);
    editor.clearSelection();
    editor.focus();
  }

  function formatOutput(data) {
    const parts = [];

    if (data.compileOutput?.trim()) {
      parts.push("--- compile ---");
      parts.push(data.compileOutput.trimEnd());
    }

    if (data.stdout?.trim()) {
      parts.push("--- stdout ---");
      parts.push(data.stdout.trimEnd());
    }

    if (data.stderr?.trim()) {
      parts.push("--- stderr ---");
      parts.push(data.stderr.trimEnd());
    }

    if (!parts.length) {
      parts.push("(no output)");
    }

    return parts.join("\n");
  }

  function setOutput(text, meta = "") {
    const outputEl = $("ideOutput");
    const metaEl = $("ideRunMeta");
    if (outputEl) outputEl.textContent = text;
    if (metaEl) metaEl.textContent = meta;
  }

  function setRunning(isRunning) {
    running = isRunning;
    const runBtn = $("ideRunBtn");
    if (runBtn) {
      runBtn.disabled = isRunning;
      runBtn.textContent = isRunning ? "Running…" : "Run code";
    }
  }

  async function runCode() {
    if (running || !editor) return;

    const language = currentLanguage();
    const code = editor.getValue();
    const stdin = $("ideStdin")?.value || "";

    saveCode(language, code);
    localStorage.setItem(STDIN_KEY, stdin);
    localStorage.setItem(LANG_KEY, language);

    setRunning(true);
    setOutput("Running…", "");

    try {
      const res = await Auth.api("/api/v1/ide/run", {
        method: "POST",
        body: JSON.stringify({ language, code, stdin }),
      });

      const data = res.data || {};
      const meta = `${data.status || "Done"} · ${data.time || "—"} · ${data.memory || "—"}`;
      setOutput(formatOutput(data), meta);
    } catch (error) {
      setOutput(error.message || "Run failed.", "Error");
    } finally {
      setRunning(false);
    }
  }

  function resetTemplate() {
    const lang = currentLanguage();
    const template = LANGUAGES[lang]?.template || "";
    if (!editor) return;
    editor.setValue(template, -1);
    editor.clearSelection();
    saveCode(lang, template);
    setOutput("Output will appear here after you run.", "");
    $("ideRunMeta").textContent = "";
  }

  function bindEvents() {
    $("ideRunBtn")?.addEventListener("click", runCode);
    $("ideResetBtn")?.addEventListener("click", resetTemplate);
    $("ideClearOutputBtn")?.addEventListener("click", () => {
      setOutput("Output will appear here after you run.", "");
      $("ideRunMeta").textContent = "";
    });

    $("ideLanguage")?.addEventListener("change", (event) => {
      const select = event.target;
      const next = select.value;
      const prev = select.dataset.prevLang;
      if (editor && prev && prev !== next) {
        saveCode(prev, editor.getValue());
      }
      select.dataset.prevLang = next;
      localStorage.setItem(LANG_KEY, next);
      setEditorLanguage(next);
    });

    $("ideStdin")?.addEventListener("input", (event) => {
      localStorage.setItem(STDIN_KEY, event.target.value);
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
    });

    editor?.session.on("change", () => {
      saveCode(currentLanguage(), editor.getValue());
    });

    themeObserver = new MutationObserver(applyEditorTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  function initEditor() {
    const host = $("ideEditor");
    if (!host || typeof ace === "undefined") return;

    editor = ace.edit(host, {
      fontSize: 14,
      showPrintMargin: false,
      tabSize: 4,
      useSoftTabs: true,
      wrap: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    editor.setOptions({
      fontFamily: "JetBrains Mono, ui-monospace, monospace",
    });

    applyEditorTheme();
  }

  function init() {
    const savedLang = localStorage.getItem(LANG_KEY);
    const langSelect = $("ideLanguage");
    if (langSelect && savedLang && LANGUAGES[savedLang]) {
      langSelect.value = savedLang;
    }
    if (langSelect) {
      langSelect.dataset.prevLang = langSelect.value;
    }

    const savedStdin = localStorage.getItem(STDIN_KEY);
    if (savedStdin && $("ideStdin")) {
      $("ideStdin").value = savedStdin;
    } else if ($("ideStdin")) {
      $("ideStdin").value = "1 2";
    }

    initEditor();
    setEditorLanguage(currentLanguage());
    bindEvents();
  }

  return { init, runCode };
})();
