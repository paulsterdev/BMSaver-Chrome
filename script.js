

const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folderSelector")
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");

const folderTitles = [];



function handleError(error)
{
    console.error(`Error occured: ${error}`);
}

let folderStructure = ``;
let folderTitle = ``;

function updateFolders(bookmarkItem) 
{
    if (!(bookmarkItem.url) && (bookmarkItem.title))
    {
        folderTitle += (folderStructure + bookmarkItem.title);
        folderTitles.push(folderTitle);
    }
  if (bookmarkItem.children) 
    {
    for (const child of bookmarkItem.children) 
    {
    if (!(bookmarkItem.url) && (bookmarkItem.title))
        {
            folderStructure += `/${bookmarkItem.title}`;
        }
      updateFolders(child);
    }
    }
    else if (!(bookmarkItem.children))
    {
        folderStructure = ``;
    }
}

function getItems(bookmarkItems) 
{
  updateFolders(bookmarkItems[0]);
}

let BMObject = chrome.bookmarks.getTree();
BMObject.then(getItems, handleError);
console.log(folderTitles);