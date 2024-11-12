# Lip Service

A template expansion plugin for Obsidian that uses Mustache-style variable syntax with added features like descriptions, dropdowns, and date pickers.

## Features
- Search-as-you-type template picker
- Variable descriptions in templates
- Optional and required fields
- Smart input handling:
  - Text input
  - Date picker
  - Dropdown selections
  - Number selections
- Smart tag parsing (spaces or commas become #tags)
- Automatic title from H1 headings
- Flexible output paths

## Usage

### Template Syntax
- Basic variable: `{{variable}}`
- Required variable: `{{variable*}}`
- With description: `{{variable|description}}`
- With options: `{{variable|option1,option2,option3}}`
- With description and options: `{{variable|description|option1,option2}}`

### Special Variables
- `{{template_output}}`: Defines output path (removed from final document)
- `{{title}}`: Used for filename (or first H1 heading with variables)
- `{{date}}`: Provides a date picker
- `{{tags}}`: Automatically formatted as #tags

### Example Templates

#### Meeting Note
```markdown
{{template_output}}/Meetings
# Meeting with {{person*|Person's name}}
Date: {{date*}}
Status: {{status|Meeting status|scheduled,in-progress,completed}}
Location: Floor {{floor|Floor number|1,2,3,4}}
Tags: {{tags}}

## Agenda
{{agenda}}

## Notes
{{notes}}
```

#### Daily Note
```markdown
{{template_output}}/Daily/{{date*}}
# Daily Note {{date*}}
Tags: {{tags}}

## Tasks
{{tasks}}

## Notes
{{notes}}
```

### Using Templates
1. Click the template icon in the ribbon or use the command palette
2. Search for your template
3. Fill in the variables (required fields marked with *)
4. Click Create

### Tips
- H1 headings with variables will be used as the filename
- Variables can be reused multiple times in the template
- Tags can be entered with or without # and separated by spaces or commas
- Date fields default to today's date when required
- Dropdown options appear in the order specified

## Settings
- Templates Folder: Set the folder where your templates are stored

## Installation
1. Download the latest release
2. Extract to your vault's `.obsidian/plugins` folder
3. Enable the plugin in Obsidian's Community Plugins settings

## License
MIT

