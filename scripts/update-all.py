import os
from bs4 import BeautifulSoup

# Function to read HTML from file
def read_html_from_file(file_name):
    with open(file_name, 'r', encoding='utf-8') as f:
        return f.read()

# Function to write modified HTML back to file
def write_html_to_file(file_name, html):
    with open(file_name, 'w', encoding='utf-8') as f:
        f.write(html)

# Function to modify HTML
def modify_html(original_html):
    # Parse the original HTML with BeautifulSoup
    soup = BeautifulSoup(original_html, 'html.parser')

    # return original html if it doesn't have <head> tag
    if soup.find('head') is None:
        return False, original_html

    # return origianl html if it already has <transposition-controller> tag
    if soup.find('transposition-controller'):
        return False, original_html
    
    # Add the <script> tag under <head>
    script_tag = soup.new_tag("script", src="./../../display/transposition.js")
    soup.head.append(script_tag)
    
    # Add the <transposition-controller> tag at the beginning of <body>
    transposition_controller_tag = soup.new_tag("transposition-controller")
    soup.body.insert(0, transposition_controller_tag)
    
    modified_html = str(soup)
    return True, modified_html 

def modify_all_song_html_files():
    # Get parent directory
    parent_directory = os.path.abspath('..')

    # Target folder with all html songs files
    target_folder =os.path.join(parent_directory, 'songs')

    # Traverse the file system
    for root, dirs, files in os.walk(target_folder):
        for file in files:
            if file.endswith('.html'):
                full_path = os.path.join(root, file)
                original_html = read_html_from_file(full_path)
                is_valid, modified_html = modify_html(original_html)
                if is_valid:
                    write_html_to_file(full_path, modified_html)

if __name__ == '__main__':
    modify_all_song_html_files()