

const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folderSelector")
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");

const folderNames = [];
const folderIDs = [];
let folderID = "";
let folderName = ``;



function handleError(error)
{
    console.error(`Error occured: ${error}`);
}

function updateFolders(bookmarkItem) 
{
    if (!(bookmarkItem.url) && (bookmarkItem.title))
    {
        folderID = bookmarkItem.id;
        folderIDs.push(folderID);
        let folderName = ``;
        let parentFolderFound = false;
        let folderIDsIndex = 0;
        for (const index of folderIDs)
        {
            if (folderIDs[index] == bookmarkItem.parentId)
            {
                parentFolderFound = true;
                folderIDsIndex = index;
            }
        }
        if (parentFolderFound)
        {
            folderName = (folderName[folderIDsIndex] + "/" + bookmarkItem.title);
        }
        else
        {
            folderName = bookmarkItem.title;
        }
        folderNames.push(folderName);
    }
    if (bookmarkItem.children)
    {
        for (const child of bookmarkItem.children) 
        {
            updateFolders(child);
        }
    }
    
    }  

function getItems(bookmarkItems) 
{
  updateFolders(bookmarkItems[0]);
}

let BMObject = chrome.bookmarks.getTree();
BMObject.then(getItems, handleError);
console.log(folderNames);
console.log(folderIDs);