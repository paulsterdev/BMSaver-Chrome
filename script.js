

const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folderSelectorMenu")
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");

const folderNames = [];
const folderIDs = [];
var folderID = "";
var folderName = ``;
var selectItemsHTML = ``;



function handleError(error)
{
    console.error(`Error occured: ${error}`);
}

function updateFolders(bookmarkItem) 
{
    if (!(bookmarkItem.url) && (bookmarkItem.title))
    {
        folderID = bookmarkItem.id.toString();
        folderIDs.push(folderID);
        let folderName = "";
        let parentFolderFound = false;
        let folderIDsIndex = 0;

        for (let index = 0; index < folderIDs.length; index++)
        {
            if (folderIDs[index] == bookmarkItem.parentId)
            {
                parentFolderFound = true;
                folderIDsIndex = index;
                break;
            }
        }
        if (parentFolderFound)
        {
            folderName = (folderNames[folderIDsIndex] + "/" + (bookmarkItem.title.toString()));
        }
        else
        {
            folderName = bookmarkItem.title.toString();
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

function writeHTML(){
    for (var i = 0; i < folderNames.length; i++)
    {
    selectItemsHTML += 
    `<option value="${folderIDs[i]}">${folderNames[i]}</option>
    `
    }
    folderSelector.innerHTML = 
`
    <label for="folderSelector">FOLDER:</label>
        <select
        name="folder"
        id="folder">
        ${selectItemsHTML}
        </select>
`;
}

function addBookmark(parentId, title, url)
{
    console.log(parentId)
    chrome.bookmarks.create(
    {
        'parentId': parentId,
        'title': title,
        'url': url,
    } 
    )
}

function controlFields()
{
    const folderOptions = document.getElementById("folder");
    saveButton.addEventListener("click", () => 
    {
        var title = nameField.value;
        var url = urlField.value;
        var parentId = folderOptions.value;
        addBookmark(parentId, title, url)
    }
    )

    clearButton.addEventListener("click", () => 
    {
        nameField.value = "";
        urlField.value = "";
        folderOptions.selectedIndex = 0;
        controlFields()
    }
    )
}

let BMObject = chrome.bookmarks.getTree();
BMObject.then(getItems, handleError)
        .then(writeHTML,handleError)
        .then(controlFields, handleError);



console.log(selectItemsHTML)


