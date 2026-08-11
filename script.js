
const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folder")
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const message = document.getElementById("message");
const newFolderButton = document.getElementById("newFolderButton");
const newFolderControls = document.getElementById("newFolderControls");
const newFolderName = document.getElementById("newFolderField");
const newFolderParentSelector = document.getElementById("parentFolder");
const submitNewFolderButton = document.getElementById("submitFolder");
const CancelNewFolderButton = document.getElementById("cancelFolder");

var folderNames = [];
var folderIDs = [];
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
            folderName = (folderNames[folderIDsIndex] + "/" + (bookmarkItem.title.toString().toUpperCase()));
        }
        else
        {
            folderName = bookmarkItem.title.toString().toUpperCase();
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
    selectItemsHTML = ``;
    folderNames = [];
    folderIDs = [];
    updateFolders(bookmarkItems[0]);
}


function writeHTML()
{
    for (var i = 0; i < folderNames.length; i++)
    {
    selectItemsHTML += 
    `<option value="${folderIDs[i]}">${folderNames[i]}</option>
    `
    }
    folderSelector.innerHTML = 
`    
        ${selectItemsHTML}
`;
}


function displayMessage(errorText, messageColor)
{
    message.style.color = messageColor;
    message.innerHTML += `<p>${errorText}</p>`;
}


function catchError(error)
{
    if (error == "Error: Invalid URL.")
    {
        console.log(error)
        urlField.style.border = "1px solid red";
        displayMessage("INVALID URL FORMAT.", "red");
    }
    else
    {
        console.log(error);
    }
}


function clearError()
{
    message.innerHTML = ``;
    nameField.style.border = "1px solid black";
    urlField.style.border = "1px solid black";
}


const cancelNewFolderButtonAction = () =>
{
    clearError();
    hideFolderControls();
    controlFields();

}


function addFolder(folderName, parentFolder)
{
    clearError();
    let newFolder = chrome.bookmarks.create({'parentId':parentFolder,'title': folderName});
    newFolder.catch(error => catchError(error));
    loadBMObject();
    hideFolderControls();
    controlFields();
}


const submitNewFolderButtonAction = () =>
{
        submitNewFolderButton.removeEventListener("click", submitNewFolderButtonAction);
            if(newFolderName.value == "")
            {
                newFolderName.style.border = "1px solid red"
                displayMessage("FOLDER NAME MUST NOT BE EMPTY.", "red");
                newFolderButtonClickAction();
            }
            else
            {
                var folderName = newFolderName.value;
                var parentFolder = newFolderParentSelector.value;
                addFolder(folderName, parentFolder);
            }
}


function unhideFolderControls()
{
    newFolderControls.style.display = "";
}


function hideFolderControls()
{
    newFolderControls.style.display = "none";
}


function newFolderButtonClickAction() 
{
        newFolderButton.removeEventListener("click", newFolderButtonClickAction);
        unhideFolderControls();
        newFolderParentSelector.innerHTML = 
        `
            ${selectItemsHTML};
        `
        submitNewFolderButton.addEventListener("click", submitNewFolderButtonAction);
        CancelNewFolderButton.addEventListener("click", cancelNewFolderButtonAction);  
}


function addBookmark(parentId, title, url)
{
    clearError();
    console.log(parentId);
    let newBookmark = chrome.bookmarks.create({'parentId': parentId,'title': title,'url': url,});
    newBookmark.catch(error => catchError(error));
}


const saveButtonAction = () =>
{
    saveButton.removeEventListener("click", saveButtonAction);
    var title = nameField.value;
    var url = urlField.value;
    var parentId = folderSelector.value;
    if(!title || !url)
    {
        if (!title && !url)
        {
            nameField.style.border = "1px solid red";
            urlField.style.border = "1px solid red";
            displayMessage("NAME AND URL CANNOT BE BLANK.", "red")
        }
        else if(!title)
        {
            nameField.style.border = "1px solid red";
            displayMessage("NAME CANNOT BE BLANK.", "red");
        }
        else if(!url)
        {
            displayMessage("URL CANNOT BE BLANK.", "red");
            urlField.style.border = "1px solid red";
        }

    }
    else
    {
        if (!(url.includes("https://")) && !(url.includes("http://")))
        {
            let preFormattedUrl = urlField.value;
            urlField.value = "http://" + preFormattedUrl;
            url = urlField.value;
        }
        addBookmark(parentId, title, url);
    }
    controlFields();
}


const clearButtonAction = () =>
{
        clearButton.removeEventListener("click", clearButtonAction);
        clearError();
        nameField.value = "";
        urlField.value = "";
        folderSelector.selectedIndex = 0;
        controlFields();
}


function controlFields()
{
    newFolderButton.addEventListener("click", newFolderButtonClickAction);
    saveButton.addEventListener("click", saveButtonAction);
    clearButton.addEventListener("click", clearButtonAction);
    
}


function loadBMObject(){
    let BMObject = chrome.bookmarks.getTree();
    BMObject.then(getItems, handleError)
            .then(writeHTML,handleError)
            .then(controlFields, handleError);
}


loadBMObject();




