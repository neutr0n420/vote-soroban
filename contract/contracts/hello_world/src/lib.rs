#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Env, Symbol};
const VOTE:Symbol = symbol_short!("VOTE");
#[contract]
pub struct VoteContract;

#[contractimpl]
impl VoteContract {
    pub fn up_vote(env: Env ) -> i32 {
        let mut votes:i32 = env.storage().instance().get(&VOTE).unwrap_or(0);
        votes +=1;

        env.storage().instance().set(&VOTE, &votes);

        env.storage().instance().extend_ttl(100, 100);
        votes
    }
    pub fn down_vote(env: Env) -> i32  {
        let mut votes = env.storage().instance().get(&VOTE).unwrap_or(0);

        votes -=1;
        log!(&env, "Removed a vote: {}", votes);

        env.storage().instance().set(&VOTE, &votes);

        env.storage().instance().extend_ttl(100, 100);
        votes
    }
    pub fn current_vote(env:Env) -> i32 {
        let current_votes = env.storage().instance().get(&VOTE).unwrap_or(0);
        current_votes
    }
}

mod test;
