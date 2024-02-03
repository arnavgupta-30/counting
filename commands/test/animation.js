const {
  SlashCommandBuilder
} = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("animation")
    .setDescription("run the animation"),
  async execute(interaction) {

    interaction.deferReply()

    const here = `
    .                                                                    :man_standing:(thinking: are women real?)  :bus: :dash:  
    .                                                                    :man_standing:(thinking: are women re :bus: :dash:  
    .                                                                    :man_standing:(thinking: are women :bus: :dash:  
    .                                                                    :man_standing:(thinking: are wo :bus: :dash:al?)
    .                                                                    :man_standing:(thinking: are  :bus: :dash:  real?)
    .                                                                    :man_standing:(thinking  a :bus: :dash: en real?)
    .                                                                    :man_standing:(think :bus: :dash: women real?)
    .                                                                    :man_standing:(thi :bus: :dash: re women real?)
    .                                                                    :man_standing: :bus: :dash:  women real?) 
    .                                                                      :bus: :dash:  
    .                                                                 :bus: :dash:  
    .                                                             :bus: :dash:
    .                                                      :bus: :dash: :man_standing:
    .                                               :bus: :dash:        :man_standing:
    .                                         :bus: :dash:              :man_standing:
    .                                    :bus: :dash:                   :man_standing: "wait did i miss the bus" 
    .                            :bus: :dash:                         :man_running: wait
    .                      :bus: :dash:                        :man_running: waittt
    .              :bus: :dash:                            :man_running: no pleaseeee
    .         :bus: :dash:                           :man_walking: eh fuck it
    .  :bus: :dash:                                 :man_walking: time to call an auto
    . :dash:                                          :man_raising_hand: "AUTOOOOOOOO"
    .                                                 :man_raising_hand:  :auto_rickshaw:  "hanji sir. kaha chaloge?"
    .   "bhai tu hauz khas leja"  :man_standing:  :auto_rickshaw:  
    .                                                 :man_standing:  :auto_rickshaw:  "200 ruppey lunga"
    .                                  "chalo"  :man_standing:  :auto_rickshaw:  
    .                                                 :man_standing:  :auto_rickshaw:  "betho sir"
    .                                                      :auto_rickshaw:  :dash: 
    .                                                   :auto_rickshaw:  :dash: 
    .                                             :auto_rickshaw:  :dash: 
    .                                      :auto_rickshaw:  :dash: 
    .                             :auto_rickshaw:  :dash: 
    .         :dog2:     :auto_rickshaw:\`=\`  (breaks hard)
    .        :dog2:   :auto_rickshaw:\`==\`  (breaks hard)
    .     :dog2: ⚞ :auto_rickshaw:  "abe ye kutta" (honks)
    .     :dog2: ⚞ :auto_rickshaw:  "hat yaha se" (honks again)
    .            ⚞ :auto_rickshaw:  "hat yaha se" (honks again)
    .                  :auto_rickshaw:     
    .                  :auto_rickshaw:    
    .            :fire::auto_rickshaw:     
    .            :fire::auto_rickshaw:    
    .            :fire::auto_rickshaw::fire:
    .            :fire::auto_rickshaw::fire:
    .            :fire::auto_rickshaw::fire:        (camera pans)
    .                  :fire::auto_rickshaw: :fire: (camera pans)
    .                           :fire::auto_rickshaw: :fire: era pans)
    .                                       :fire::auto_rickshaw: :fire: ns)
    .                                         (cam  :fire::auto_rickshaw: :fire:
    .                                         (camera pan:fire::auto_rickshaw: :fire: 
    .                                         (camera pans)        :fire::auto_rickshaw: :fire:   
    .                                                                          :levitate:     :fire::auto_rickshaw: :fire:   
    .                                                                          :levitate:     :fire::auto_rickshaw: :fire:   
    .                                                                    :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .                                                                    :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .       "bhai teri to auto hi jal gayi"        :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .       "bhai teri to auto hi jal gayi"        :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .                                "mein ja raha."        :man_standing::levitate:     :fire::auto_rickshaw: :fire:  
    .                                "mein ja raha."        :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .                           "dukh hua sunke"        :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .                           "dukh hua sunke"        :man_standing::levitate:     :fire::auto_rickshaw: :fire:   
    .                                                                    :man_walking:     :levitate:     :fire::auto_rickshaw: :fire: 
    .                                                                :man_walking:          :levitate:     :fire::auto_rickshaw:
    .                                                            :man_walking:                :levitate:     :fire:
    .                                                        :man_walking:                        :levitate:    
    .                                                    :man_walking:                              :levitate: 
    .                                                    :man_walking:                              :levitate: 
    .                                                :man_walking: 
    .                                                :man_standing: 
    .                                                :man_standing:   "salla abh kya karu?"       
    .                                                :man_standing:   "salla abh kya karu?"       `.split("\n").splice(1)

    var i = 0;

    const interval = setInterval(() => {
      if (i === here.length) {
        clearInterval(interval)
        return interaction.editReply("Animation ended")
      }
      interaction.editReply(here[i])
      i++;
    }, 1000);

  }
}