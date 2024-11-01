let _id: string;

const UserService = {
    initialize() : void {

    }, 
    
    getUser() :string {
        console.log("Getting user:", _id);
        return _id;
    },

    setUser(id: string) :void {
        console.log("Setting user:", id)
        _id = id;
    }
}

export default UserService;