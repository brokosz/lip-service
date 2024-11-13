# Lip Service

A template expansion plugin for Obsidian that uses Mustache-style variable syntax with added features like descriptions, dropdowns, and date pickers.

## Features
- Search-as-you-type template picker
- Variable descriptions and validators
- Required and optional fields
- Smart input handling:
  - Text input
  - Date picker
  - Dropdown selections
  - Number selections
- Smart tag parsing (spaces or commas become #tags)
- Flexible output paths with variable support
- H1 headers with variables become filenames

## Usage

### Template Syntax
- Basic variable: `{{variable}}`
- Required variable: `{{variable*}}`
- With description: `{{variable|description}}`
- With options: `{{variable|option1,option2,option3}}`
- With description and options: `{{variable|description|option1,option2}}`

### Special Variables
- `{{template_output}}` - Defines output path, can include other variables. The line with this variable is removed from the final document
- `{{date}}` - Provides a date picker (defaults to today)
- `{{tags}}` - Automatically formatted as #tags (can be space or comma-separated)

### Example Templates

#### Meeting Note
```markdown
{{template_output}}/Meetings/{{project}}
# Meeting with {{person*|Meeting attendee name}}
Date: {{date*}}
Status: {{status|Meeting status|scheduled,in-progress,completed}}
Location: Floor {{floor|Floor number|1,2,3,4}}
Tags: {{tags}}

## Agenda
{{agenda}}

## Notes
{{notes}}
```

#### Interview Note
```markdown
{{template_output}}/Interviews/Tech/{{candidate}}
# {{candidate*}} Tech Interview

Date: [[{{date*}}]]
Interviewer: {{interviewer*}}
Position: {{position}}
Tags: {{tags}}

## Notes
{{notes}}
```

### File Path Handling

If your template has:
```markdown
{{template_output}}/Projects/{{client}}
```

The output file path will be:
1. `/Projects/Acme` - if template_output is left empty
2. `/Projects/Acme/2024` - if template_output is set to "2024"

### Title Handling

The plugin determines the output filename in this order:
1. First H1 header with variables resolved (e.g., `# Meeting with {{person}}` becomes "Meeting with John.md")
2. If no H1, uses `{{title}}` if present
3. Falls back to templatename_date.md

### Tips
- H1 headers with variables will be used as the filename
- Variables can be reused multiple times in the template
- Tags can be entered with or without # and separated by spaces or commas
- Date fields default to today's date when required
- Dropdown options appear in the order specified
- Required fields are marked with an asterisk (*)
- Unfilled optional fields remain as variables in the output

## Settings
- Templates Folder: Set the folder where your templates are stored

## Installation
1. Download the latest release
2. Extract to your vault's `.obsidian/plugins` folder
3. Enable the plugin in Obsidian's Community Plugins settings

## License
MIT
