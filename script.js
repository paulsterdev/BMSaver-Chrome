

const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folderSelectorMenu")
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

        console.log(`FOR ${bookmarkItem.title}`);
        for (let index = 0; index < folderIDs.length; index++)
        {
            console.log(folderIDs[index]);
            console.log(bookmarkItem.parentId);
            if (folderIDs[index] == bookmarkItem.parentId)
            {
                parentFolderFound = true;
                folderIDsIndex = index;
                break;
            }
        }
        if (parentFolderFound)
        {
            folderName = (folderNames[folderIDsIndex] + "/" + bookmarkItem.title);
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

selectItemsHTML = ``;

for (var index = 0; index < folderIDs.length; index++)
{
    selectItemsHTML += 
    `<option value="${folderIDs[index]}">${folderNames[index]}</option>`
}

if (document.getElementById("folderSelectorMenu"))
{
    console.log("Element found.")
}

folderSelector.innerHTML = 
`
    <label for="folderSelector">Folder:</label>
        <select
        name="folder"
        id="folder">
        ${selectItemsHTML}
        </select>
`;

