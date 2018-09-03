#!/usr/bin/python
import datetime
import subprocess
import sys

def postUsage():
    print('usage:\n' +
          ' new_post name   - create new post\n' +
          ' new_post go     - copy files to raspberry pi\n')

if len(sys.argv) == 2:
    if sys.argv[1] == 'go':
        subprocess.call('scp -r ../html raspi:~', shell=True)
    elif sys.argv[1] == '-h':
        postUsage()
    else:
        # === create new post from template ===
        postName = sys.argv[1]
        today = datetime.date.today().strftime("%d/%m/%y")
        newFile = 'post/' + postName + '.html'

        # reading template into memory
        lines = []
        with open('post/template.html', 'r') as f:
            lines = f.readlines()
        # changing template
        for i, l in enumerate(lines):
            if l.strip().startswith('<p>Published on'):
                lines[i] = '            <p>Published on ' + \
                    today + ' by Tomás Abril</p>\n'
            if l.strip().startswith('<h2>title'):
                lines[i] = '    <h2>' + postName.replace('-', ' ') + '</h2>\n'
        # writing fo file
        with open(newFile, 'w+') as f:
            f.writelines(lines)
        print('new post created from template')

        # === update main site ===
        # reading main site into memory
        lines = []
        with open('index.html', 'r') as f:
            lines = f.readlines()
        # changing lines
        for i, l in enumerate(lines):
            if l.strip().startswith('<h5>Past posts'):
                lines.insert(i + 2, '  <p><a href="./' + newFile + '">' +
                             today + ' - ' + postName.replace('-', ' ') + '</a></p>\n')
        # writing fo file
        with open('index.html', 'w+') as f:
            f.writelines(lines)
        print('index.html updated')

else:
   postUsage()


