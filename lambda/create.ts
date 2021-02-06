// TODO figure out event type shape
exports.handler = async (event:any) => {
  console.log(JSON.stringify(event, undefined, 2));

  console.log('Table name is: ', process.env.POST_TABLE);
  
  // TODO write input to table
  // Return the note id
  return 'Note created';
}