class ValidChallenge {
    constructor(user_id, challenge_id, job_id){
        if(!user_id){
            throw "user_id [arg1] cannot be null!";
        } else if(!challenge_id && !job_id){
            throw "challenge_id [arg2] and job_id [arg3] cannot both be null!";
        }
        this.user_id = user_id;
        this.challenge_id = challenge_id;
        this.job_id = job_id;
    }

    // write js check_function for dv2_condition
}

exports.ValidChallenge = ValidChallenge