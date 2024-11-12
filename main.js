/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MustacheTemplatesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  templatesFolder: "templates"
};
var MustacheTemplatesPlugin = class extends import_obsidian.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addRibbonIcon("book-template", "Add from template", () => {
        new TemplatePickerModal(this.app, this).open();
      });
      this.addCommand({
        id: "create-from-template",
        name: "Create note from template",
        callback: () => {
          new TemplatePickerModal(this.app, this).open();
        }
      });
      this.addSettingTab(new MustacheTemplateSettingTab(this.app, this));
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  getTemplates() {
    const templatesFolder = this.app.vault.getAbstractFileByPath(this.settings.templatesFolder);
    if (!templatesFolder || !(templatesFolder instanceof import_obsidian.TFolder)) {
      return [];
    }
    return templatesFolder.children.filter((file) => file instanceof import_obsidian.TFile).filter((file) => file.extension === "md").map((file) => file.basename);
  }
  getTemplate(templateName) {
    return __async(this, null, function* () {
      const templatePath = `${this.settings.templatesFolder}/${templateName}.md`;
      const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
      if (!(templateFile instanceof import_obsidian.TFile))
        return null;
      return yield this.app.vault.read(templateFile);
    });
  }
  extractTemplateVariables(template) {
    const matches = Array.from(template.matchAll(/\{\{([^}]+)\}\}/g));
    const variableMap = /* @__PURE__ */ new Map();
    matches.forEach((match, idx) => {
      let [name, ...parts] = match[1].trim().split("|");
      const required = name.endsWith("*");
      name = name.replace("*", "").trim();
      if (!variableMap.has(name)) {
        let type = "text";
        let description;
        let options;
        if (name.toLowerCase().includes("date")) {
          type = "date";
        }
        parts.forEach((part) => {
          part = part.trim();
          if (part.includes(",")) {
            type = "select";
            options = part.split(",").map((o) => o.trim());
          } else if (/^\d/.test(part)) {
            type = "number";
            options = part.split(",").map((o) => o.trim());
          } else {
            description = part;
          }
        });
        variableMap.set(name, {
          name,
          type,
          required,
          index: idx,
          description,
          options
        });
      }
    });
    return Array.from(variableMap.values()).sort((a, b) => a.index - b.index);
  }
  extractTitle(template, data) {
    const h1Match = template.match(/^# (.+)$/m);
    if (h1Match) {
      let title = h1Match[1];
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\*?\\s*\\}\\}`, "g");
        title = title.replace(regex, value);
      });
      return title;
    }
    if ("title" in data) {
      return data["title"];
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return `${template}_${today}`;
  }
  parseTags(input) {
    return input.split(/[\s,]+/).map((tag) => tag.trim()).filter((tag) => tag.length > 0).map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" ");
  }
  createFromTemplate(templateName, data) {
    return __async(this, null, function* () {
      try {
        const template = yield this.getTemplate(templateName);
        if (!template) {
          new import_obsidian.Notice("Template not found");
          return;
        }
        console.log("Template:", template);
        console.log("Data received:", data);
        if ("tags" in data) {
          data["tags"] = this.parseTags(data["tags"]);
        }
        const outputPath = data["template_output"];
        delete data["template_output"];
        const fileName = this.extractTitle(template, data).replace(/[\\/:*?"<>|]/g, "_") + ".md";
        let filePath;
        if (outputPath) {
          let normalizedPath = outputPath.startsWith("/") ? outputPath : "/" + outputPath;
          normalizedPath = normalizedPath.endsWith("/") ? normalizedPath.slice(0, -1) : normalizedPath;
          if (normalizedPath !== "/") {
            const folders = normalizedPath.split("/").filter((f) => f.length > 0);
            let currentPath = "";
            for (const folder of folders) {
              currentPath += "/" + folder;
              if (!(yield this.app.vault.adapter.exists(currentPath))) {
                yield this.app.vault.createFolder(currentPath);
              }
            }
          }
          filePath = normalizedPath === "/" ? fileName : `${normalizedPath}/${fileName}`;
        } else {
          filePath = fileName;
        }
        let rendered = template;
        console.log("Starting template:", rendered);
        Object.entries(data).forEach(([key, value]) => {
          console.log(`Replacing ${key} with ${value}`);
          const regex = new RegExp(
            `\\{\\{\\s*${key}(?:\\s*\\*)?(?:\\s*\\|[^}]*)?\\s*\\}\\}`,
            "g"
          );
          rendered = rendered.replace(regex, value);
          console.log("After replacement:", rendered);
        });
        rendered = rendered.replace(/\{\{\s*template_output(?:\s*\*)?(?:\s*\|[^}]*)?\\s*\}\}/g, "");
        console.log("Final rendered:", rendered);
        const file = yield this.app.vault.create(filePath, rendered);
        yield this.app.workspace.getLeaf(false).openFile(file);
        new import_obsidian.Notice(`Note created at ${filePath}`);
      } catch (error) {
        console.error("Error creating note:", error);
        new import_obsidian.Notice("Failed to create note: " + (error instanceof Error ? error.message : String(error)));
      }
    });
  }
};
var TemplatePickerModal = class extends import_obsidian.SuggestModal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.setInstructions([
      { command: "\u2191\u2193", purpose: "to navigate" },
      { command: "\u21B5", purpose: "to select" },
      { command: "esc", purpose: "to dismiss" }
    ]);
    this.setPlaceholder("Type to find template...");
  }
  getSuggestions(query) {
    const templates = this.plugin.getTemplates();
    return templates.filter(
      (template) => template.toLowerCase().includes(query.toLowerCase())
    );
  }
  renderSuggestion(template, el) {
    el.createEl("div", { text: template });
  }
  onChooseSuggestion(template, evt) {
    return __async(this, null, function* () {
      const templateContent = yield this.plugin.getTemplate(template);
      if (templateContent) {
        new TemplateVariablesModal(
          this.app,
          this.plugin,
          template,
          templateContent
        ).open();
      }
    });
  }
};
var TemplateVariablesModal = class extends import_obsidian.Modal {
  constructor(app, plugin, templateName, templateContent) {
    super(app);
    this.plugin = plugin;
    this.templateName = templateName;
    this.templateContent = templateContent;
    this.variables = {};
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: `Fill in template: ${this.templateName}` });
    const formContainer = contentEl.createDiv("template-form");
    const variables = this.plugin.extractTemplateVariables(this.templateContent);
    if (variables.length === 0) {
      formContainer.createEl("p", { text: "No variables found in template" });
      return;
    }
    variables.forEach((variable) => {
      if (variable.name !== "template_output") {
        const setting = new import_obsidian.Setting(formContainer).setName(variable.name + (variable.required ? " *" : "")).setDesc(variable.description || (variable.required ? "Required" : "Optional"));
        const options = variable.options;
        if ((variable.type === "select" || variable.type === "number") && options) {
          setting.addDropdown((dropdown) => {
            if (!variable.required) {
              dropdown.addOption("", "Choose...");
            }
            options.forEach((option) => {
              dropdown.addOption(option, option);
            });
            if (variable.required && options.length > 0) {
              dropdown.setValue(options[0]);
              this.variables[variable.name] = options[0];
            }
            dropdown.onChange((value) => {
              this.variables[variable.name] = value;
            });
          });
        } else if (variable.type === "date") {
          setting.addText((text) => {
            text.inputEl.type = "date";
            if (variable.required) {
              const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
              text.setValue(today);
              this.variables[variable.name] = today;
            }
            text.onChange((value) => {
              this.variables[variable.name] = value;
            });
          });
        } else {
          setting.addText((text) => {
            text.setPlaceholder(variable.description || (variable.required ? "Required" : "Optional")).onChange((value) => {
              this.variables[variable.name] = value;
            });
          });
        }
      }
    });
    if (variables.some((v) => v.name === "template_output")) {
      new import_obsidian.Setting(formContainer).setName("Save Location").setDesc("Path where the file will be saved").addText((text) => text.setPlaceholder("e.g., folder/subfolder").onChange((value) => {
        this.variables["template_output"] = value;
      }));
    }
    new import_obsidian.Setting(formContainer).addButton((btn) => {
      btn.setButtonText("Create").setCta().onClick(() => __async(this, null, function* () {
        const missingRequired = variables.filter((v) => v.required && v.name !== "template_output").filter((v) => !this.variables[v.name]);
        if (missingRequired.length > 0) {
          new import_obsidian.Notice(`Please fill in required fields: ${missingRequired.map((v) => v.name).join(", ")}`);
          return;
        }
        yield this.plugin.createFromTemplate(this.templateName, this.variables);
        this.close();
      }));
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var MustacheTemplateSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Templates folder").setDesc("Folder where templates are stored").addText((text) => text.setValue(this.plugin.settings.templatesFolder).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.templatesFolder = value;
      yield this.plugin.saveSettings();
    })));
  }
};
