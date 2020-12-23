if im fetching data given a user's command input..
with the command being: `.fetch SPECIFIC_ID`

if (msg.content === '.fetch SPECIFIC_ID') {
const response = await getUserInfo(SPECIFIC_ID)
// ...
// return data for the specific ID specified by the User
}

export const getUserInfo = async (SPECIFIC_ID) => {

const URL = '/user/${SPECIFIC_ID}'

}
